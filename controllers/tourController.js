// const fs = require('fs');
const Tour=require('./../models/tourModel');


// 
exports.getAllTours = async (req, res) => {
  try{
    //1.} FIELTRING 
    //2.}QUERY BUILDING 
    const queryObj={...req.query};
    const excludedFields=['page','sort','limit','fields'];
    excludedFields.forEach(el=>delete queryObj[el]);
    console.log(req.query,queryObj);
    
    //2}ADVANCED FILTERING
    let queryStr=JSON.stringify(queryObj);
    queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);
    console.log(JSON.parse(queryStr));

    const query=Tour.find(queryObj);

    // const tours=await Tour.find(queryObj);
    // const tours=await Tour.find().
    // where('duration').equals(5).
    // where('difficulty').equals('easy');
    const tours=await query;
    res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
  }catch(err){
     res.status(400).json({
      status:'fail',
      message:err.message
    });
  }
  console.log(req.requestTime);


};

exports.getTour = async  (req, res) => {
  try{
    const tour = await Tour.findById(req.params.id);
    //Tour.findOne({_id:req.param.id})
     res.status(200).json({
    status: 'success',
    data: {
      tour
    }
    });
  }catch(err){
    res.status(400).json({
      status:'fail',
      message:err.message
    });
  }
 
};

exports.createTour = async (req, res) => {
  try{

    // const newTour=new Tour({})
    // newTour.save();
    const newTour = await Tour.create(req.body);

   res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
  }catch(err){
    res.status(400).json({
      status:'fail',
      message:err.message
    })
  }
};

exports.updateTour = async (req, res) => {
  try{
    const tour=await Tour.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  }catch(err){
     res.status(400).json({
      status:'fail',
      message:err.message
    });
  }
};

exports.deleteTour = async (req, res) => {
  try{
      const tour=await Tour.findByIdAndDelete(req.params.id);
      res.status(204).json({
      status: 'success',
      data: null
  });
  }catch(err){
      res.status(400).json({
      status:'fail',
      message:err.message
    });
  }
 
};
