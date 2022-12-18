const Comments=require('../models/commentModal');
const Posts=require('../models/postModal');
const Users=require('../models/userModel');

class APIfeatues{
    constructor(query,queryString){
        this.query=query;
        this.queryString=queryString
    }

    pagination(){
        const page=this.queryString.page*1 || 1
        const limit=this.queryString.limit * 1 || 3
        const skip=(page-1) * limit
        this.query=this.query.skip(skip).limit(limit)
        return this;
    }
}

const postController={
      createPost:async(req,res)=>{
          try {
              const {content,images}=req.body;

              const newPost=new Posts({
                  content,images,user:req.user._id
              })
              await newPost.save();
              res.json({msg:'Create Post!',newPost:{
                  ...newPost._doc,
                  user:req.user
              }});
          } catch (error) {
              return res.status(500).json({msg:error.message});
          }
      },
      getPosts:async(req,res)=>{
          try {
              const features=new APIfeatues(Posts.find({user:[...req.user.following,req.user._id]}),req.query).pagination();
              const posts=await features.query.sort('-createdAt')
              .populate('user likes','avatar username fullname followers')
              .populate({
                  path:'comments',
                  populate:{
                      path:"user likes",
                      select:"-password"
                  }
              });

              res.json({
                  msg:'Sucess!',
                  result:posts.length,
                  posts
              })
          } catch (error) {
            return res.status(500).json({msg:error.message});
          }
      },
      updatePost:async(req,res)=>{
        try {
            const {content,images}=req.body;
            const post=await Posts.findOneAndUpdate({_id:req.params.id},{
                content,images
            }).populate('user likes','avatar username fullname').populate({
                path:'comments',
                populate:{
                    path:"user likes",
                    select:"-password"
                }
            });

           
            res.json({
                msg:"Update Post!!",
                newPost:{
                    ...post._doc,
                    content,images
                }
            })
        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    },
    likePost:async(req,res)=>{
        try {

            const post=await Posts.find({_id:req.params.id,likes:req.user._id});
            if(post.length>0) return res.status(400).json({msg:"You Liked this post"});


          const like=await Posts.findOneAndUpdate({_id:req.params.id},{
              $push:{likes:req.user._id}
          },{new:true})  

          if(!like) return res.status(400).json({msg:"This post does not exist"});

          res.json({msg:"Liked Post"})
        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    },
    unLikePost:async(req,res)=>{
        try {

          const like=await Posts.findOneAndUpdate({_id:req.params.id},{
              $pull:{likes:req.user._id}
          },{new:true})  
    
          if(!like) return res.status(400).json({msg:"This post does not exist"});
          res.json({msg:"UnLiked Post"})
        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    },
    getUserPosts:async(req,res)=>{
        try {
            const features=new APIfeatues(Posts.find({user:req.params.id}),req.query).pagination()

            const posts=await features.query.sort("-createdAt");

            res.json({posts,
            result:posts.length,
        
        });
        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    },
    getPost:async(req,res)=>{
        try {
            const post=await Posts.findById(req.params.id) .populate('user likes','avatar username fullname followers').sort('-createdAt')
            .populate({
                path:'comments',
                populate:{
                    path:"user likes",
                    select:"-password"
                }
            });

            if(!post) return res.status(400).json({msg:"This post does not exist"});

            res.json({post});
        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    },
    getPostDiscover:async(req,res)=>{
        try {
          
            // const features=new APIfeatues(Posts.find({user:{$nin:[...req.user.following,req.user._id]}}),req.query).pagination();
            // const posts=await features.query.sort('-createdAt')
         
            const newArr=[...req.user.following,req.user._id]
            const num=req.query.num || 9;
            const posts=await Posts.aggregate([
                {$match:{user:{$nin:newArr}}},
                {$sample:{size:Number(num)}}
            ]).project("-password")

    
            res.json({
                msg:'Sucess!',
                result:posts.length,
                posts
            })
        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    },
    deletePost:async(req,res)=>{
        try {
            const post =await Posts.findOneAndDelete({_id:req.params.id,user:req.user._id});

            await Comments.deleteMany({_id:{$in:post.comments}});

            res.json({msg:"Delete Post!",
             newPost:{
                 ...post,
                 user:req.user
             }
    });
        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    } ,
    savedPost:async(req,res)=>{
        try {
            const user=await Users.find({_id:req.user.id,saved:req.params.id});
            if(user.length>0) return res.status(400).json({msg:"You saved this post"});


          const save=await Users.findOneAndUpdate({_id:req.user._id},{
              $push:{saved:req.params.id}
          },{new:true})  

          if(!save) return res.status(400).json({msg:"This post does not exist"});

          res.json({msg:"Saved Post"})
        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    },
    unSavedPost:async(req,res)=>{
        try {
           
          const unsave=await Users.findOneAndUpdate({_id:req.user._id},{
              $pull:{saved:req.params.id}
          },{new:true})  

          if(!unsave) return res.status(400).json({msg:"This post does not exist"});

          res.json({msg:"Unsaved Post"})
        } catch (error) {
            return res.status(500).json({msg:error.message});
        }
    },
    getSavedPosts:async(req,res)=>{
        try {
           const features=new APIfeatues(Posts.find({_id:{$in:req.user.saved}}),req.query).pagination();

           const savedPosts=await features.query.sort("-createdAt");

           

           res.json({
               savedPosts,
               result:savedPosts.length
           })
          
          } catch (error) {
              return res.status(500).json({msg:error.message});
          }
    }    
}

module.exports=postController