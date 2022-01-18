const Conversations=require('../models/conversationModal');
const Message=require('../models/messageModal');

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

const messageController={
   createMessage:async(req,res)=>{
       try {
           const {sender,recipient,text,media,call}=req.body;

           if(!recipient || (!text.trim() && media.length ===0 &&!call)) return;
           const newConversation=await Conversations.findOneAndUpdate({
               $or:[
                   {recipients:[sender,recipient]},
                   {recipients:[recipient,sender]}
               ]
           },{
              recipients:[sender,recipient],
              text,media,call
           },{new:true,upsert:true})

           const newMessage=new Message({
               conversation:newConversation._id,
               sender,call,
               recipient,text,media
           })

           await newMessage.save();

           return res.status(200).json({msg:'Create Success!'});
       } catch (error) {
           return res.status(500).json({msg:error.message});
       }
   },
   getConversation:async(req,res)=>{
       try {
           const features=new APIfeatues(Conversations.find({
               recipients:req.user._id
           }),req.query).pagination()

           const conversations=await features.query.sort('-updatedAt').populate('recipients','avatar username fullname')

           res.json({conversations,
            result:conversations.length
        });
       } catch (error) {
        return res.status(500).json({msg:error.message});
       }
   },
   getMessages:async(req,res)=>{
       try {
        const features=new APIfeatues(Message.find({
            $or:[
                {sender:req.user._id,recipient:req.params.id},
                {sender:req.params.id,recipient:req.user._id}
            ]
        }),req.query).pagination()

        const messages=await features.query.sort('-createdAt')

        res.json({messages,
         result:messages.length
     });
       } catch (error) {
        return res.status(500).json({msg:error.message});
       }
   },
   deleteMessage:async(req,res)=>{
       try {
           await Message.findOneAndDelete({_id:req.params.id,sender:req.user._id});
           res.json({msg:"Delete Message"});
       } catch (error) {
        return res.status(500).json({msg:error.message});
       }
   },
   deleteConversation:async(req,res)=>{
    try {
        const newConversation=await Conversations.findOneAndDelete({
            $or:[
                {recipients:[req.user._id,req.params.id]},
                {recipients:[req.params.id,req.user._id]}
            ]
        });
        await Message.deleteMany({conversation:newConversation._id});
        res.json({msg:"Delete Conversation"});
    } catch (error) {
     return res.status(500).json({msg:error.message});
    }
   }
}

module.exports=messageController;