const chatInput = document.querySelector('#typinginput');
const sendBtn = document.querySelector('#sendbtn');
const container = document.querySelector('.container');

var input = null;
const createElement = (html,className)=>{
    const newDiv = document.createElement('div');
    newDiv.classList.add('chat',className);
    newDiv.innerHTML=html;
    return newDiv;
}

const outGoingText =()=>{
    input = chatInput.value.trim();
    const html = `<div class="chatcontent">
                <div class="chatdetails">
                    <img src="Images/you.png">
                    <p>${input}</p>
                </div>
            </div>`
    
    const outGoing = createElement(html,'outgoing');
    container.appendChild(outGoing);
    container.scrollTop = container.scrollHeight;
    setTimeout(typingDots,500);
    chatInput.value = "";
}

const typingDots = ()=>{
    const Dots = `<div class="chatcontent">
                <div class="chatdetails">
                    <img src="Images/KAI.png">
                    <div class="typing-animation">
                        <div class="typingDot" style="--delay:0.2s"></div>
                        <div class="typingDot" style="--delay:0.3s"></div>
                        <div class="typingDot" style="--delay:0.4s"></div>
                    </div>
                 </div>
            </div>`

    const incommingDots = createElement(Dots,"incomming");
    container.appendChild(incommingDots);
    getResponse(input,incommingDots);
}

const getResponse = async (input,incommingDots)=>{
    const resElement = document.createElement('p');
    try{
    const response = await fetch("http://localhost:3000/chat",{
        method : 'POST',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
        messages:[
            {role : "system", content : " Your KARTHIK, A helpful AI friend"},
            {role : "user",content : input}
        ]
    }),
    })
    
    const data = await response.json();
    const rawText = data.choices[0].message.content;
    if (rawText.includes("```")) {
      const codeContent = rawText.match(/```(?:[a-z])\n([\s\S]?)```/);
      if (codeContent) {
        resElement.innerHTML = `<pre><code>${codeContent[1]}</code></pre>`;
      } else {
        resElement.innerHTML = rawText.replace(/\n/g, "<br>");
      }
    } else {
      resElement.innerHTML = rawText.replace(/\n/g, "<br>");
    }
    }catch(error){
        resElement.textContent = "Something went wrong Please Try again😊"
    }

    incommingDots.querySelector('.typing-animation').remove();
    incommingDots.querySelector('.chatdetails').appendChild(resElement);
    container.scrollTop = container.scrollHeight;
    const copyButton = document.createElement('i');
    copyButton.className = "fa-regular fa-copy copy-btn mt-2 ms-2";
    copyButton.style.cursor = "pointer";
    copyButton.title = "Copy";
    incommingDots.appendChild(copyButton);
    copyButton.addEventListener("click",()=>{
        copySymbol(copyButton);
    })
}

const copySymbol = (copyButton)=>{
    const responseText = copyButton.parentElement.querySelector('p');
    navigator.clipboard.writeText(responseText.textContent);
    copyButton.classList.remove("fa-copy");
    copyButton.classList.add("fa-check");
    setTimeout(()=>{
        copyButton.classList.remove("fa-check");
        copyButton.classList.add("fa-copy");
    },1000);
}

sendBtn.addEventListener('click',outGoingText);
chatInput.addEventListener('keydown',(e)=>{
    if(e.key === "Enter" &!e.shiftKey){
        e.preventDefault();
        outGoingText();
    }
})

const themeButton = document.getElementById("theme-button");
const darkTheme = "dark-theme";
const sunIconClass = "uil-sun";
const moonIconClass = "uil-moon";

const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? "dark" : "light";

const getCurrentIcon = () =>
  themeButton.classList.contains(sunIconClass) ? "uil-sun" : "uil-moon";

if (selectedTheme) {
  document.body.classList[selectedTheme === "dark" ? "add" : "remove"](darkTheme);

  themeButton.classList.remove(sunIconClass, moonIconClass);
  themeButton.classList.add(selectedIcon);
}

themeButton.addEventListener("click", () => {
  document.body.classList.toggle(darkTheme);

  if (themeButton.classList.contains(moonIconClass)) {
    themeButton.classList.remove(moonIconClass);
    themeButton.classList.add(sunIconClass);
  } else {
    themeButton.classList.remove(sunIconClass);
    themeButton.classList.add(moonIconClass);
  }

  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});