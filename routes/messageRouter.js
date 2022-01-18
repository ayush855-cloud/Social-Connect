const messageController = require('../controllers/messageController');
const auth=require('../middleware/auth');
const router=require('express').Router();


router.post('/message',auth,messageController.createMessage);
router.get('/conversations',auth,messageController.getConversation);
router.get('/message/:id',auth,messageController.getMessages);
router.delete('/message/:id',auth,messageController.deleteMessage);
router.delete('/conversations/:id',auth,messageController.deleteConversation);

module.exports=router;