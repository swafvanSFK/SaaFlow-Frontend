import { Check, Copy, Download, ExternalLink, FileText, X } from "lucide-react"
import { useState } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const isPdfUrl = (url) => {
  if (!url || typeof url !== "string") return false
  return /\.pdf(\?|$)/i.test(url) || /pdf-[0-9]+\.pdf/i.test(url)
}

const isImageUrl = (url) => {
  if (!url || typeof url !== "string") return false
  if (isPdfUrl(url)) return false
  return (
    /\.(png|jpe?g|webp|gif|svg)(\?|$)/i.test(url) ||
    url.includes("image.pollinations.ai") ||
    /image-[0-9]+\.(png|jpe?g|webp)/i.test(url)
  )
}

const MessageBubble = ({role, content, images}) => {

  const isUser = role === "user"
  const [lightBox, setLightBox] = useState(null)
  const [copyCode, setCopyCode] = useState("")

  const handleCopyCode = async (code) => {
    await navigator.clipboard.writeText(code)
    setCopyCode(code)
    setTimeout(() => setCopyCode(""), 2000)
  }

  const explicitImages = (Array.isArray(images) ? images.filter(Boolean) : []).filter(isImageUrl)
  
  const extractedImages = []
  const extractedPdfs = []

  const urlRegex = /(https?:\/\/[^\s<>)"]+)/gi
  if (content && typeof content === "string") {
    const matches = content.match(urlRegex) || []
    matches.forEach((rawUrl) => {
      const cleanUrl = rawUrl.trim().replace(/[),.]+$/, '')
      if (isPdfUrl(cleanUrl)) {
        if (!extractedPdfs.includes(cleanUrl)) {
          extractedPdfs.push(cleanUrl)
        }
      } else if (isImageUrl(cleanUrl)) {
        if (!explicitImages.includes(cleanUrl) && !extractedImages.includes(cleanUrl)) {
          extractedImages.push(cleanUrl)
        }
      }
    })
  }

  const allImages = explicitImages.length > 0 ? explicitImages : extractedImages

  let displayContent = content || ""
  if (allImages.length > 0 && typeof displayContent === "string") {
    allImages.forEach((imgUrl) => {
      displayContent = displayContent.replace(imgUrl, "").trim()
    })
  }

  if (extractedPdfs.length > 0 && typeof displayContent === "string") {
    extractedPdfs.forEach((pdfUrl) => {
      // Clean up raw bare URL strings that are not part of a markdown [text](url) link
      displayContent = displayContent.replace(new RegExp(`(?<!\\]\\()${pdfUrl.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'g'), "").trim()
    })
  }

  return (
    <div className={`flex ${isUser ? "justify-end": "justify-start"}`}>
        <div className={`w-fit max-w-[92vw] md:max-w-[72%] px-4 py-2 rounded-2xl break-words overflow-hidden leading-relaxed
          ${isUser ? "bg-gradient-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm" : "text-slate-200 rounded-tl-sm"}`}>
          
          {displayContent && (
            <Markdown remarkPlugins={[remarkGfm]} components={{
              img: ({src, alt}) => (
                <div className="my-2">
                  <img
                    src={src}
                    alt={alt || "Image"}
                    onClick={() => setLightBox(src)}
                    loading="lazy"
                    className="max-w-xs md:max-w-md rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition"
                  />
                </div>
              ),
              h1: ({children}) => <h1 className="text-lg font-bold text-white mt-4 mb-2 first:mt-0">{children}</h1>,
              h2: ({children}) => <h2 className="text-base font-bold text-white mt-3.5 mb-1.5 first:mt-0">{children}</h2>,
              h3: ({children}) => <h3 className="text-[15px] font-semibold text-slate-100 mt-3 mb-1 first:mt-0">{children}</h3>,
              h4: ({children}) => <h4 className="text-sm font-semibold text-slate-200 mt-2.5 mb-1 first:mt-0">{children}</h4>,
              h5: ({children}) => <h5 className="text-sm font-medium text-slate-200 mt-2 mb-1 first:mt-0">{children}</h5>,
              h6: ({children}) => <h6 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mt-2 mb-1 first:mt-0">{children}</h6>,
              p: ({children}) => <p className="mb-3 whitespace-pre-wrap break-words last:mb-0">{children}</p>,
              strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
              ul: ({children}) => <ul className="list-disc pl-5 my-2 space-y-1 text-sm text-slate-300">{children}</ul>,
              ol: ({children}) => <ol className="list-decimal pl-5 my-2 space-y-1 text-sm text-slate-300">{children}</ol>,
              li: ({children}) => <li className="leading-relaxed">{children}</li>,
              a: ({href, children}) => {
                const isPdf = isPdfUrl(href)
                if (isPdf) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-200 hover:text-white text-xs font-medium transition cursor-pointer no-underline my-1.5 shadow-sm"
                    >
                      <FileText size={14} className="text-red-400" />
                      <span>{children || "Download PDF Document"}</span>
                      <Download size={13} className="ml-0.5 text-red-300" />
                    </a>
                  )
                }
                return (
                  <a href={href} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 cursor-pointer inline-flex items-center gap-1">
                    {children} <ExternalLink size={15}/>
                  </a>
                )
              },
              table: ({children}) => (
                <div className="my-3 w-full overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-left text-xs border-collapse">
                    {children}
                  </table>
                </div>
              ),
              thead: ({children}) => <thead className="bg-white/[0.06] border-b border-white/10 text-slate-200 font-semibold">{children}</thead>,
              tbody: ({children}) => <tbody className="divide-y divide-white/[0.06] text-slate-300">{children}</tbody>,
              tr: ({children}) => <tr className="hover:bg-white/[0.02] transition-colors">{children}</tr>,
              th: ({children}) => <th className="px-3.5 py-2.5 font-semibold text-slate-100">{children}</th>,
              td: ({children}) => <td className="px-3.5 py-2 whitespace-normal break-words">{children}</td>,
              code: ({className, children}) => {
                const value = String(children).trim()

                if(!className) {
                  return (
                    <code className="px-1.5 py-0.5 rounded bg-white/10 text-indigo-200">{value}</code>
                  )
                }
                const language = className.replace("language-","")
                return (
                  <div className="my-4 overflow-hidden rounded-xl border border-white/10 bg-[#111318]">
                    <div className="flex items-center justify-between bg-[#1b1d24] border-b border-white/10 px-4 py-2">
                      <span className="uppercase text-xs text-slate-400">{language}</span>
                      <button onClick={()=>handleCopyCode(value)} className="flex items-center gap-1.5 text-xs cursor-pointer">
                        {copyCode === value ? <><Check size={14}/>Copied</> : <><Copy size={14}/>Copy</>} 
                      </button>
                    </div>
                    <SyntaxHighlighter language={language} style={oneDark} showLineNumbers wrapLongLines customStyle={{margin:0, padding:"16px", backgroundColor: "#0d1117", fontSize:"13px"}} >
                      {value}
                    </SyntaxHighlighter>  
                  </div>
                )
              }
            }}>
              {displayContent} 
            </Markdown>
          )}

          {extractedPdfs.length > 0 && (
            <div className="flex flex-col gap-2 mt-3">
              {extractedPdfs.map((pdfUrl, i) => {
                const fileNameMatch = pdfUrl.match(/([^\/?#]+\.pdf)/i)
                const displayName = fileNameMatch ? decodeURIComponent(fileNameMatch[1]) : "Document.pdf"

                return (
                  <a
                    key={i}
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 hover:border-red-500/40 transition-all duration-200 group no-underline max-w-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 group-hover:scale-105 transition-transform flex-shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white group-hover:text-red-300 transition-colors truncate">
                          {displayName}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          PDF Document • Click to view / download
                        </div>
                      </div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/5 text-slate-300 group-hover:text-white group-hover:bg-red-500/20 transition-all flex-shrink-0">
                      <Download size={16} />
                    </div>
                  </a>
                )
              })}
            </div>
          )}

          {allImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {allImages.map((img, i) => (
                <div key={i} className="relative group overflow-hidden rounded-xl border border-white/10 bg-black/20">
                  <img 
                    key={i} 
                    src={img} 
                    alt={`Visual ${i + 1}`}
                    onClick={()=>setLightBox(img)} 
                    loading="lazy" 
                    className="max-w-[280px] sm:max-w-sm max-h-72 w-auto h-auto rounded-xl object-cover cursor-zoom-in group-hover:scale-[1.02] transition duration-200" 
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {lightBox && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6" onClick={()=>setLightBox(null)}>
              <button onClick={()=>setLightBox(null)} className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2 cursor-pointer">
                <X size={32} className="text-white"/>
              </button>
              <img src={lightBox} alt="Lightbox view" className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain" />
            </div>
        )}
    </div>
  )
}

export default MessageBubble