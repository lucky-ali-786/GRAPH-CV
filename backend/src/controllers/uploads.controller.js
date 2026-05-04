import { uploadFileOnCloudinary } from '../utils/cloudinary.js';
import fs from 'fs';
import { User } from '../models/users.model.js';
import { mainqueue } from '../bullmq/producer.js';
import { asynchandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/apierror.js';
import { Apiresponse } from '../utils/Apiresponse.js';
import { Job } from '../models/jobs.models.js';
export const uploadResumeImages = asynchandler(async (req, res) => {  
    const files = req.file;
    const userId = req.user._id;
    if (!files) {
      throw new ApiError(400, "No image uploaded");
    }
    const result = await uploadFileOnCloudinary(files.path);   
    await User.findByIdAndUpdate(userId, {
      $push: { 
        resume: { links: result.secure_url } 
      }
    });

    const job = await mainqueue.add('resume-roaster', {
      userId: userId.toString(),
      imageUrl: result.secure_url ,
       type:"roast"
    });
    return res.status(200).json(new Apiresponse(200, { job }, "Roast job created successfully"));
});
export const uploadForAtsEvaluation = asynchandler(async (req, res) => {  
    const resumeFile = req.files?.resumeImage?.[0];
    const jdFile = req.files?.jdImage?.[0];
    const userId = req.user._id;
    if (!resumeFile || !jdFile) {
        if (resumeFile) fs.unlinkSync(resumeFile.path);
        if (jdFile) fs.unlinkSync(jdFile.path);
        throw new ApiError(400, "Both Resume and Job Description images are required");
    }

     const [resumeResult, jdResult] = await Promise.all([
        uploadFileOnCloudinary(resumeFile.path),
        uploadFileOnCloudinary(jdFile.path)
    ]);
    
    await User.findByIdAndUpdate(userId, {
        $push: { 
          resume: { links: resumeResult.secure_url } 
        }
    });

    const job = await mainqueue.add('evaluate-resume', {
        userId: userId.toString(),
        resumeImageUrl: resumeResult.secure_url, 
        jdImageUrl: jdResult.secure_url,
        type:"resume-evaluation"          
    });

    return res.status(200).json(new Apiresponse(200, { job }, "ATS Evaluation job created successfully"));
});
export const uploadForEnhancement = asynchandler(async (req, res) => {  
    const file = req.file; 
    const userId = req.user._id;

    if (!file) {
      throw new ApiError(400, "Resume image is required for enhancement");
    }

    const result = await uploadFileOnCloudinary(file.path);   
    
    await User.findByIdAndUpdate(userId, {
      $push: { 
        resume: { links: result.secure_url } 
      }
    });

    const job = await mainqueue.add('enhance-resume', {
      userId: userId.toString(),
      resumeImageUrl: result.secure_url,
      type:"resume-enhancement"
    });

    return res.status(200).json(new Apiresponse(200, { job }, "Resume enhancement job created successfully"));
});
export const getRoastHistory = asynchandler(async (req, res) => {
    const userId = req.user._id;

    const history = await Job.find({ 
        user: userId, 
        type: "roast" 
    }).sort({ createdAt: -1 });

    return res.status(200).json(
        new Apiresponse(200, history, "Roast history fetched successfully")
    );
});
export const getEvaluationHistory = asynchandler(async (req, res) => {
    const userId = req.user._id;
    const history = await Job.find({ 
        user: userId, 
        type: "resume-evaluation" 
    }).sort({ createdAt: -1 });

    return res.status(200).json(
        new Apiresponse(200, history, "ATS evaluation history fetched successfully")
    );
});
export const getEnhancementHistory = asynchandler(async (req, res) => {
    const userId = req.user._id;
    const history = await Job.find({ 
        user: userId, 
        type: "resume-enhancement" 
    }).sort({ createdAt: -1 });

    return res.status(200).json(
        new Apiresponse(200, history, "Resume enhancement history fetched successfully")
    );
});
export const getActiveRoastJobs = asynchandler(async (req, res) => {
    const userId = req.user._id.toString();
    const jobs = await mainqueue.getJobs(['waiting', 'active', 'delayed']);
    const userRoastJobs = jobs.filter(job => 
        job.name === 'resume-roaster' && job.data.userId === userId
    );
    const jobsData = await Promise.all(userRoastJobs.map(async (job) => ({
        jobId: job.id,
        state: await job.getState(),
        progress: job.progress
    })));
    return res.status(200).json(new Apiresponse(200, jobsData, "Active roast jobs fetched"));
});
export const getActiveEvaluationJobs = asynchandler(async (req, res) => {
    const userId = req.user._id.toString();
    
    const jobs = await mainqueue.getJobs(['waiting', 'active', 'delayed']);
    
    const userEvalJobs = jobs.filter(job => 
        job.name === 'evaluate-resume' && job.data.userId === userId
    );

    const jobsData = await Promise.all(userEvalJobs.map(async (job) => ({
        jobId: job.id,
        state: await job.getState(),
        progress: job.progress
    })));

    return res.status(200).json(new Apiresponse(200, jobsData, "Active evaluation jobs fetched"));
});
export const getActiveEnhancementJobs = asynchandler(async (req, res) => {
    const userId = req.user._id.toString();
    
    const jobs = await mainqueue.getJobs(['waiting', 'active', 'delayed']);
    
    const userEnhanceJobs = jobs.filter(job => 
        job.name === 'enhance-resume' && job.data.userId === userId
    );

    const jobsData = await Promise.all(userEnhanceJobs.map(async (job) => ({
        jobId: job.id,
        state: await job.getState(),
        progress: job.progress
    })));

    return res.status(200).json(new Apiresponse(200, jobsData, "Active enhancement jobs fetched"));
});