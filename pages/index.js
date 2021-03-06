import { useState } from 'react'
import NavBar from '../components/NavBar'
import {useRouter} from 'next/router' 
import generatePassword from '../utils/passwordGenerator'

import axios from 'axios';


export default function Home() {
  const router = useRouter()
  // const API = axios.create( { baseURL : 'http://localhost:5000' } )

  const [file , setFile] = useState(null)
  const [password , setPassword] = useState("")
  const [generatedPassword , setGeneratedPassword] = useState("");
  const [copiedMessage , setCopiedMessage] = useState(false)

  const fillPassword = () => {
    const newPassword = generatePassword()
    setGeneratedPassword(newPassword)
  }

  const handleCopyClick = () => { 
    navigator.clipboard.writeText(generatedPassword)
    setCopiedMessage(true)

    setTimeout(()=>{
      setCopiedMessage(false)
    } , 2000)
  }

  const handleFileUpload = (e)=> {
    setFile(e.target.files[0])
  }
  const handleFilePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleFormSubmit =  async (e) => { 
    e.preventDefault()
    const formData = {file : file , password : password}

    axios({
      method: 'post',
      url: 'https://safeshare-cg22.herokuapp.com/upload',
      data: formData,
      headers: {'Content-Type': 'multipart/form-data' }
    
    })
    .then(res => {
      console.log(res.data.fileId)
      router.push({
        pathname : '/share', 
        query: { fileId : res.data.fileId }
      })
    })
    .catch(err => console.log(err.message))

  }


  return (
  <div className='w-[100%]'>

    <NavBar/>

    <div  className='w-[100%] max-w-[1400px] m-auto h-[100vh] flex '>
      <div className='w-[30%] mark px-[15px] py-[20px]'>
        <h1 className='text-[20px] font-[400]'>Welcome to SafeShare</h1>
        <h1 className='mb-[10px]'>This platform provides you with service to share all types of files protected by a password .</h1>

        <h1 className='mb-[10px]'><span className='text-[20px] font-[400]'>Step 1 :</span> Upload your file</h1>
        <h1 className='mb-[10px]'><span className='text-[20px] font-[400]'>Step 2 :</span> Set a password ! You can choose not to but we recommend to do so . You can use our password generator to generate a safe password .</h1>
        <h1 className='mb-[10px]'><span className='text-[20px] font-[400]'>Step 3 :</span> You receive a shortened URL . Share the password and url with whoever you want to share the file with.</h1>
        
      </div>

      <div className='w-[70%]  '>
        <div className='mark h-[280px] m-[20px] p-[20px] rounded-[10px] '> 
          <h1 className='text-[30px] font-seminbold '>File Upload</h1>
          <div className='h-[85%] flex justify-center items-center'>
              <form onSubmit={(e) => handleFormSubmit(e)} method="POST" action="http://localhost:5000/upload" encType="multipart/form-data" className='w-[100%] my-auto flex flex-col justify-between items-center  h-[80%] ' > 
                <div className='form-group w-[90%]  flex justify-between'>
                  <label htmlFor="file " className='w-[14%] text-[1.2rem] flex items-center '>File : </label>
                  <input id = "file" name ="file" type="file"  className='w-[85%] ' onChange={(e) => handleFileUpload(e)} />
                </div>
                <div className='form-group  w-[90%]  flex justify-between'>
                  <label htmlFor="pasword" className='w-[14%] text-[1.2rem] flex items-center '> Password :</label>
                  <input className="w-[85%] border-[2px] border-cyan-200 rounded-[5px] p-[10px]" id = "pasword" name ="pasword" type="pasword"  onChange={(e) => handleFilePassword(e)}/>
                </div>

                <button className='w-[90%] border-[2px] rounded-[5px] p-[10px] bg-cyan-200 text-[1rem] font-medium' type='submit'>Share</button>
              </form>

          </div>
        </div>
        <div className='mark h-[250px] m-[20px] p-[20px] rounded-[10px]'>
          <h1 className='text-[30px] font-seminbold '>Password Generator</h1>
          <div className='flex justify-center items-center h-[90%]'>
            <div className='w-full flex flex-col justify-between items-center h-[63%] my-auto '>
                <div className='w-[90%] relative '>
                  <input id='generatedPassword' className='m-auto w-full border-[2px] border-cyan-200 rounded-[5px] p-[10px]' defaultValue={generatedPassword} onChange={(e)=>setGeneratedPassword(e.target.value)}/>
                  {generatedPassword!="" && <button className = "w-[fit-content] absolute right-[0.5rem] top-[0.25rem] border-[2px] rounded-[5px] p-[10px] bg-cyan-200 text-[1rem] font-medium cursor-pointer" onClick={handleCopyClick}> 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='h-[1rem]'><path d="M21 10v10a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1zM6 14H5V5h9v1a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2z"/></svg>
                  </button>}

                  { copiedMessage && 
                  <div className='bg-cyan-200 w-[fit-content] p-[10px] font-semibold rounded-[10px] absolute bottom-[53px] right-[-0.05rem] '>
                    Copied
                  </div>}
                  
                </div>
                <button className='w-[90%] border-[2px] rounded-[5px] p-[10px] bg-cyan-200 text-[1rem] font-medium' onClick={fillPassword}>Generate Password</button>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
   
  )
}
