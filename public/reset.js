
const forgetPasswordForm = document.getElementById("forget-password-form");

const errorMsg = document.getElementById('error');

const port = 3000; 

forgetPasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
  
    try {
        const response = await axios.post(`http://localhost:${port}/password/forgotpassword`, { email });
        
        if (response.status === 202) {
            alert('Mail sent successfully');
        } else {
            throw new Error('Something went wrong!!!');
        }

        document.getElementById('email').value = "";
        
        
        alert(response.data.message);
    } catch (error) {
        console.error('Error adding user:', error);
     
        document.body.innerHTML += `<div style="color:red;">${error.message}</div>`;
    }
});
