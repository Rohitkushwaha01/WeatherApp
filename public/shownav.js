const ham = document.querySelector('.ham');
const ul = document.querySelector('ul');
const nav = document.querySelector('#navbar')

ham.addEventListener('click', ()=>{
    ul.classList.toggle('show');
    nav.classList.toggle('show-height');
    console.log("clicked")
})