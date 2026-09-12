import { X } from "lucide-react"
import { useState } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

const MessageBubble = ({role, content, images}) => {

  const isUser = role === "user"
  const [lightBox, setLightBox] = useState(null)

  return (
    <div className={`flex ${isUser ? "justify-end": "justify-start"}`}>
        <div className={`w-fit max-w-[92vw] md:max-w-[72%] px-4 py-2 rounded-2xl break-words overflow-hidden leading-relaxed
          ${isUser ? "bg-gradient-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm" : "text-slate-200 rounded-tl-sm"}`}>
          
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {images.map((img, i) => (
                <img key={i} src={img} onClick={()=>setLightBox(img)} loading="lazy" onError={(e) => e.currentTarget.remove()} className="w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition" />
              ))}
            </div>
          )}
          
          <Markdown remarkPlugins={[remarkGfm]} components={{
            img: () => null,
            h1: ({children}) => <h1 className="text-lg font-bold text-white mt-4 mb-2 first:mt-0">{children}</h1>,
            h2: ({children}) => <h2 className="text-base font-bold text-white mt-3.5 mb-1.5 first:mt-0">{children}</h2>,
            h3: ({children}) => <h3 className="text-[15px] font-semibold text-slate-100 mt-3 mb-1 first:mt-0">{children}</h3>,
            h4: ({children}) => <h4 className="text-sm font-semibold text-slate-200 mt-2.5 mb-1 first:mt-0">{children}</h4>,
            h5: ({children}) => <h5 className="text-sm font-medium text-slate-200 mt-2 mb-1 first:mt-0">{children}</h5>,
            h6: ({children}) => <h6 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mt-2 mb-1 first:mt-0">{children}</h6>,
            p: ({children}) => <p className="mb-3 whitespace-pre-wrap break-words">{children}</p>,
            strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
            ul: ({children}) => <ul className="list-disc pl-5 my-2 space-y-1 text-sm text-slate-300">{children}</ul>,
            ol: ({children}) => <ol className="list-decimal pl-5 my-2 space-y-1 text-sm text-slate-300">{children}</ol>,
            li: ({children}) => <li className="leading-relaxed">{children}</li>,
            a: ({href, children}) => <a href={href} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 cursor-pointer">{children}</a>,
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
          }}>
            {content} 
          </Markdown>    
        </div>

        {lightBox && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6" onClick={()=>setLightBox(null)}>
              <button onClick={()=>setLightBox(null)} className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2 cursor-pointer">
                <X size={32} className="text-white"/>
              </button>
              <img src={lightBox} className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain" />
            </div>
        )}
    </div>
  )
}

export default MessageBubble