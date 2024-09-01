// import React, { useEffect, useState } from 'react';
// import { useNavigate } from "react-router-dom";

// export const UpdateProfile = () => {
//     const [updateUsername, setUpdateUsername] = useState('');
//     const [updateEmail, setUpdateEmail] = useState('');
//     const [updateContact, setUpdateContact] = useState('');
//     const [updatePassword, setUpdatePassword] = useState('');
//     const [showForm, setShowForm] = useState(false);
//     const [fillpas,setFillpass]=useState('');

//     const navigate = useNavigate();

//     useEffect(() => {
//         if (!localStorage.getItem('token')) {
//             navigate('/login');
//         }
//     }, [navigate]);

//     const handleProfileUpdate = () => {
//         prompt('Enter you password')

//         setFillpass
//         setShowForm(true);
//     };

//     const handleUpdateProfile = () => {
//         const password = prompt("Enter your password");
//         console.log('Updating profile with the following details:');
//         console.log('Username:', updateUsername);
//         console.log('Email:', updateEmail);
//         console.log('Contact:', updateContact);
//         console.log('Password:', password);

//         // Add your logic to handle profile update here, e.g., API call
//     };

//     return (
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//             <button className='btn btn-primary' onClick={handleProfileUpdate}>
//                 UPDATE PROFILE INFORMATION
//             </button>
//             {showForm && (
//                 <div className="signup-container" style={{ marginTop: '20px' }}>
//                     <div className="signup-box">
//                         <h1>Fill the Updated Details</h1>
//                         <input
//                             className="form-control"
//                             type="text"
//                             placeholder="USERNAME"
//                             value={updateUsername}
//                             onChange={(e) => setUpdateUsername(e.target.value)}
//                         />
//                         <input
//                             className="form-control"
//                             type="text"
//                             placeholder="CONTACT NUMBER"
//                             value={updateContact}
//                             onChange={(e) => setUpdateContact(e.target.value)}
//                         />
//                         <input
//                             className="form-control"
//                             type="text"
//                             placeholder="EMAIL"
//                             value={updateEmail}
//                             onChange={(e) => setUpdateEmail(e.target.value)}
//                         />
//                         <input
//                             className="form-control"
//                             type="password"
//                             placeholder="PASSWORD"
//                             value={updatePassword}
//                             onChange={(e) => setUpdatePassword(e.target.value)}
//                         />
//                         <button className="btn btn-primary" onClick={handleUpdateProfile}>
//                             Update 
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
