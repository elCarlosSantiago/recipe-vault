[POST] REGISTER (/api/auth/register). 
---------------------

*receives*    

{  
  username,  
  password,  
  email  
}   

*returns*    
{   
  user_id,  
  username,  
  email   
}

[POST] LOGIN (/api/auth/login). 
---------------------

*receives*  

{  
  username,  
  password  
}

*returns*    
  
{  
  message,  
  user_id,  
  username,  
  token  
}   
