if(document.getElementById('app-min')){
    document.getElementById('app-min').addEventListener("click",function(){
        this.style.display = "none";
        document.getElementById('chat-app').style.display = "block";
    });
}

if(document.getElementById('app-max')){
    document.getElementById('app-max').addEventListener("click",function(){
        document.getElementById('app-min').style.display = "block";
        document.getElementById('chat-app').style.display = "none";
    });
}

var forms = document.getElementsByTagName("form");
for(let i = 0; i < forms.length; i++){
    forms[i].onsubmit = async (e)=>{
        e.preventDefault()
        const formData = new FormData(forms[i]);
        const req = await fetch(forms[i].action,{method:"POST",body:formData});
        const res = await req.json();
       
       if(res.status == 'error' && res.errors.length > 0){
        console.log(res.errors);
        if(document.getElementById('ojp_form_error'))document.getElementById('ojp_form_error').remove();
        var errorDiv = document.createElement('div');
        errorDiv.id="ojp_form_error";
        for(let i = 0; i < res.errors.length; i++){
            let error = document.createElement('p');
            error.style.cssText = `color:red`
            error.innerText = res.errors[i]
            errorDiv.append(error);
        }
        forms[i].insertBefore(errorDiv,forms[i].children[0]);

        }else if(res.redirect){
         window.location = res.redirect;
        }
        
    }
}