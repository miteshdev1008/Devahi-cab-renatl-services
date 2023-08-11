// const ispassword=(pass)=>{
//     const a= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/
//     let digit=/^[0-9]$/;
//    let upc=/(?=.*[A-Z])/;
//     let smc=/(?=.*[a-z])/;
//     let spc=/[@#$%^&-+=()]/;
//      if(!upc.test(pass)){
//              return "please enter uppercase in password"
//      }
//     //  else if(!digit.test(pass))
//     //  {
//     //     console.log(!digit.test(pass)+typeof(pass))
//     //     return "please enter digit in password"
//     //  }
//      else if(!smc.test(pass))
//      {
//         return "please enter small alphabats in password"
//      }
//      else if(!spc.test(pass))
//      {
//         return "please enter special character in password"
//      }
//      else if(pass.length<8)
//      {
//         return "your password must be 8 characters";
//      }
//      else{
//         return true;
//      }
//  }
function ispassword(password) {
  console.log(password.length)
  if (password.length <= 7) {
    return "Enter 8 characters Password.";
  } else if (!/\d/.test(password)) {
    return "Password must contain at least one numeric digit (0-9).";
  } else if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase alphabet.";
  } else if (!/[^a-zA-Z0-9\s]/.test(password)) {
    return "Password must contain at least one special character.";
  }
  else if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase alphabet.";
  }
  else {
    return true;
  }
}
module.exports = { ispassword }