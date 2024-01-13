import logo from './logo.svg';
import './App.css';
import {useState} from 'react';


function Header(props){
  // console.log('props',props, props.title)
  return <header>
            <h1><a href="/" onClick={function (event) {
              event.preventDefault();
              props.onChangeMode();
            }}>{props.title}</a></h1>
        </header>
}

function Nav(props){
  // console.log(props.topics)
  const lis = [
  ]
  for (let i = 0; i < props.topics.length; i++) {
    let t = props.topics[i]
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={event=>{
        event.preventDefault();
        props.onChangeMode(Number(event.target.id))
      }}>{t.title}</a>
      </li>)
  }
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}

function Article(props) {
  return <article>
          <h2>{props.title}</h2>
          {props.body}
          <h3>git 올라가는거 확인</h3>
        </article>
}

function Create(props) {
  return <article>
          <h2>Create</h2>
          <form onSubmit={event=>{
            event.preventDefault();
            const title = event.target.title.value;
            const body = event.target.body.value;
            props.onCreate(title, body);
          }}>
            <p><input type="text" name='title' placeholder='title' /></p>
            <p><textarea name="body" placeholder='body'></textarea></p>
            <p><input type="submit" value="Create" /></p>
          </form>
        </article>
}


function Update(props) {
  const [now_title, setTitle] = useState(props.title);
  const [now_body, setBody] = useState(props.body);
  return <article>
          <h2>Update</h2>
          <form onSubmit={event=>{
            event.preventDefault();
            const new_title = event.target.title.value;
            const new_body = event.target.body.value;
            props.onUpdate(new_title, new_body);
          }}>
            <p><input type="text" name='title' placeholder='title' value={now_title} onChange={event=>{
              // console.log(event.target.value)
              setTitle(event.target.vlaue)
            }}/></p>
            <p><textarea name="body" placeholder='body' value={now_body} onChange={event=>{
              setBody(event.target.value)
            }}></textarea></p>
            <p><input type="submit" value="Update" /></p>
          </form>
        </article>
}



function App() {
  // const _mode = useState('WELCOME'); 
  // const mode = _mode[0];
  // const setMode = _mode[1];
  const [mode,setMode] = useState('WELCOME');
  const [id,setId] = useState(null)
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id:1, title:'html',body:'html is ...'},
    {id:2, title:'css',body:'css is ...'},
    {id:3, title:'javascript',body:'javascript is ...'},
  ])


  let content = null;
  let contextControl = null;

  if (mode === 'WELCOME'){
    content = <Article title="Welcome" body="Hello, WEB"></Article>
      
    
  }else if(mode === 'READ'){
    let title,body = null;
    for (let i = 0; i < topics.length; i++) {
      // console.log(topics[i].id,id);
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <>
    <li><a href={"/update/"+id} onClick={event=>{
      event.preventDefault();
      setMode('UPDATE');
    }}>Update</a></li>
    <li><input type="button" value='Delete' onClick={event=>{
      const newTopics = []
      for (let i = 0; i < topics.length; i++) {
        if(topics[i].id !== id) {
          newTopics.push(topics[i]);
        }
      }
      setTopics(newTopics)
      setMode('WELCOME')
    }}/>
    </li>
    </>


  } else if (mode==='CREATE') {
    content = <Create onCreate={(title, body)=>{
      const newTopic = {id:nextId, title:title,body:body}
      const newTopics = [...topics]
      newTopics.push(newTopic);
      setTopics(newTopics);
      // 상세 페이지로 가기위한 조작
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  

  } else if (mode==='UPDATE') {
    let title,body = null;
    let update_id = null;
    for (let i = 0; i < topics.length; i++) {
      // console.log(topics[i].id,id);
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
        update_id = i
      }
    }
    content = <Update title={title} body={body} onUpdate={(new_title,new_body)=>{
      const updatedTopic = {id:id, title:new_title, body:new_body}
      const newTopics = [...topics]
      for (let i = 0; i < newTopics.length; i++) {
        if (newTopics[i].id === id) {
          newTopics[i] = updatedTopic;
          break;
        }
      }
      // newTopics[update_id] = updatedTopic
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }



  return (
    <div>
      <Header title="WEB" onChangeMode={function () {
        setMode('WELCOME');
      }}></Header>

      <Nav topics={topics} onChangeMode={(_id)=>{
        setMode('READ');
        setId(_id);
      }}></Nav>

      {content}

      <ul>
        <li>
          <a href="/create" onClick={event=>{
            event.preventDefault();
            setMode('CREATE');
          }}>Create</a>
        </li>
        {contextControl}
      </ul>

    </div>
  );
}

export default App;
