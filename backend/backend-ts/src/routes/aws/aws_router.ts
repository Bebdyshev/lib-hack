import { Router } from 'express';
import { AwsService } from './aws_service';
import { AwsController } from './aws_controller';
import multer from 'multer';

const awsRouter = Router();

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const awsService = new AwsService();
const awsController = new AwsController(awsService);

awsRouter.post('/upload-media', upload.single('file'), awsController.saveToAws);

export default awsRouter;
