// import { Message } from "@/src/utils/types";
// import { baseUrl } from ".";

// export const sendMess = async (message:Message) => {
//     try {
//       const response = await fetch(`${baseUrl}/messages`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           sender_id: message.userId,
//           content: message.text
//         }),
//       });
//       console.log(response);
      

//       if (response.ok) {
//         const data = await response.json();
        
//         // Add bot response with typing effect
//         const botMessage: Message = {
//           id: data.id,
//           userId: 'bot',
//           text: data.content,
//           isUser: false,
//           timestamp: data.date,
//         };
//         console.log(botMessage);
//         return botMessage
//       } else {
//         throw new Error('Failed to send message');
//       }
//     } catch (e:any) {
//       console.error('Error sending message:', e);  
//       throw new Error(e.response?.data?.message || "Erreur de connexion");
//     }
// }

// export const get = async (id:string) => {
//     try {
//       const response = await fetch(`${baseUrl}/messages/${id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();        
//         return data;
//       } else {
//         throw new Error('Failed to send message');
//       }
//     } catch (e:any) {
//       console.error('Error sending message:', e);  
//       throw new Error(e.response?.data?.message || "Erreur de connexion");
//     }
// }