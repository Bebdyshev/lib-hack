from flask import Flask, request, jsonify
from flask_cors import CORS
from typing import Optional
import numpy as np
import torch
from transformers import CLIPModel, CLIPProcessor, CLIPTokenizer
import pinecone
from pinecone import Pinecone
import os
from PIL import Image
import io 
import openai


app = Flask(name)
CORS(app)  # Enable CORS for all routes

# Initialize Pinecone
api_key = os.getenv("API_KEY")
pc = Pinecone(api_key=api_key)
index = pc.Index("lib-hack")
text_index = pc.Index("lib-hack-2")

def get_model_info(model_ID, device):
    model = CLIPModel.from_pretrained(model_ID).to(device)
    processor = CLIPProcessor.from_pretrained(model_ID)
    tokenizer = CLIPTokenizer.from_pretrained(model_ID)
    return model, processor, tokenizer

model_ID = "openai/clip-vit-large-patch14"
device = "cuda" if torch.cuda.is_available() else "cpu"
model, processor, tokenizer = get_model_info(model_ID, device)

def get_single_image_embedding(my_image, processor, model, device):
    image = processor(images=my_image, return_tensors="pt")["pixel_values"].to(device)
    embedding = model.get_image_features(image)
    return embedding.cpu().detach().numpy()

from transformers import AutoTokenizer, AutoModel

openai.api_key = os.getenv("OPENAI")
def get_text_embedding(text, model="text-embedding-ada-002"):
   text = text.replace("\n", " ")
   return openai.embeddings.create(input = [text], model=model).data[0].embedding

@app.route("/", methods=["GET"])
def read_root():
    return jsonify({"message": "Hello, World!"})

@app.route("/search/neiro-image", methods=["POST"])
def search_by_image():
    try:
        file = request.files['file']
        image = file.read()
        image = np.frombuffer(image, np.uint8)  # Convert bytes to numpy array
        image_pil = Image.open(io.BytesIO(image))  # Convert numpy array to PIL image
        embedding = get_single_image_embedding(image_pil, processor, model, device)

        embeddings_list = embedding.tolist()        
        # Perform search in Pinecone
        results = index.query(vector=embeddings_list, top_k=10, include_metadata=True)  # Adjust top_k as needed
        print(results)
        return jsonify({"results": results.to_dict()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/search/neiro-text", methods=["GET"])
def search_by_text():
    try:
        prompt = request.args.get('prompt')
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400
        
        embedding = get_text_embedding(prompt)

        if embedding is None:
            return jsonify({"error": "Failed to get embeddings"}), 500

                
        results = text_index.query(vector=embedding, top_k=10, include_metadata=True) 
        return jsonify({"results": results.to_dict()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if name == "main":
    app.run(host="0.0.0.0", debug=True)