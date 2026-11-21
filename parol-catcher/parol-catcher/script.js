(function(){
  var board=document.getElementById('board'),scoreEl=document.getElementById('score'),timeEl=document.getElementById('time'),bestEl=document.getElementById('best');
  var cells=[],score=0,best=0,left=30,playing=false,tick,spawn,active={};
  for(var i=0;i<9;i++){
    var c=document.createElement('button');
    c.className='cell';c.type='button';c.setAttribute('aria-label','Square '+(i+1));
    c.addEventListener('pointerdown',(function(n){return function(e){e.preventDefault();hit(n)}})(i));
    c.addEventListener('keydown',(function(n){return function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();hit(n)}}})(i));
    board.appendChild(c);cells.push(c);
  }
  var ov=document.createElement('div');ov.id='overlay';
  ov.innerHTML='<h3>Ready?</h3><p>Catch gold parols for 30 seconds.</p><button class="go" type="button">Start</button>';
  board.appendChild(ov);
  ov.querySelector('button').addEventListener('click',start);

  function setScore(v){score=Math.max(0,v);scoreEl.textContent=score}
  function clear(n){var c=cells[n];c.className='cell';if(active[n]){clearTimeout(active[n].t);delete active[n]}}
  function show(){
    if(!playing)return;
    var free=[];for(var i=0;i<9;i++)if(!active[i])free.push(i);
    if(free.length){
      var n=free[Math.floor(Math.random()*free.length)],bad=Math.random()<0.25;
      cells[n].className='cell up '+(bad?'bad':'good');
      var life=Math.max(550,1100-(30-left)*18);
      active[n]={bad:bad,t:setTimeout(function(){clear(n)},life)};
    }
    spawn=setTimeout(show,Math.max(320,720-(30-left)*14));
  }
  function hit(n){
    if(!playing||!active[n])return;
    var bad=active[n].bad;clear(n);
    cells[n].classList.add('hit');setTimeout(function(){cells[n].classList.remove('hit')},120);
    setScore(score+(bad?-2:1));
    if(navigator.vibrate&&bad)navigator.vibrate(60);
  }
  function start(){
    ov.hidden=true;playing=true;left=30;setScore(0);timeEl.textContent=left;
    for(var i=0;i<9;i++)clear(i);
    tick=setInterval(function(){left--;timeEl.textContent=left;if(left<=0)end()},1000);
    show();
  }
  function end(){
    playing=false;clearInterval(tick);clearTimeout(spawn);
    for(var i=0;i<9;i++)clear(i);
    var isBest=score>best;if(isBest){best=score;bestEl.textContent=best}
    ov.innerHTML='<h3>Time’s up!</h3><p>You caught '+score+' '+(score===1?'point':'points')+(isBest&&score>0?'. New best!':'.')+'</p><button class="go" type="button">Play again</button>';
    ov.hidden=false;ov.querySelector('button').addEventListener('click',start);
    ov.querySelector('button').focus();
  }
})();
