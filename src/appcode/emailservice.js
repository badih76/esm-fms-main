import emailjs from '@emailjs/browser';

export const EmailType = {
    NEW_TKT: 'new_ticket_001',
    REPLY_TKT: 'ticket_action_001'
}

export const sendEmail = (templateParams, emailType, emailServiceID, emailServiceUserID) => {    
    return emailjs.send(emailServiceID, 
                        emailType, templateParams, 
                        emailServiceUserID);
}