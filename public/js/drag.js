const dragArea = document.querySelector('.drag-area');
const dragText = document.querySelector('.header');

let button= document.querySelector('.button');
let input= document.querySelector('#imageInput');
let file;
 
button.onclick= () =>{
    input.click();
};
//browse
input.addEventListener('change',function(){
    file=this.files[0];    
    dragArea.classList.add('active');
    displayFile();
});

function displayFile(){
 let fileType = file.type;
    let validExtensions=['image/jpeg','image/jpg','image/png'];

    if(validExtensions.includes(fileType)){
        let fileReader= new FileReader();  
    
        fileReader.onload=()=>{
            let fileURL=fileReader.result;
            let imgTag=`<img src="${fileURL}" alt="">`;
            dragArea.innerHTML=imgTag;            
        };
        fileReader.readAsDataURL(file);
    }
        else{
                 alert('This file is not a image');
                 dragArea.classList.remove('active');
        
    }
}


dragArea.addEventListener('dragover', (e)=>{
    e.preventDefault();
     dragText.textContent='Release to upload';
     dragArea.classList.add('active');
});

dragArea.addEventListener('dragleave', ()=>{
    dragText.textContent='drag and drop';
    dragArea.classList.remove('active');
});

dragArea.addEventListener('drop', (e)=>{
    e.preventDefault();    
    file = e.dataTransfer.files[0];
    input.files = e.dataTransfer.files;
    displayFile();
});







