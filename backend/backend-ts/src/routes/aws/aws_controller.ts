import { Request, Response } from "express";
import { AwsService } from "./aws_service";

export class AwsController{
    private awsService: AwsService;

    constructor(awsService: AwsService) {
        this.awsService = awsService;
    }

    saveToAws = async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded.' });
            }

            const file = req.file.buffer;
            const fileName = req.file.originalname;

            const bucketName = 'nf-2024'; 
            const fileUrl = await this.awsService.uploadFile(bucketName, file, fileName);

            res.status(200).json({ fileUrl });
        } catch (err) {
            console.error('Error saving file to AWS:', err);
            res.status(500).json({ message: 'Error saving file to AWS.' });
        }
    }
}