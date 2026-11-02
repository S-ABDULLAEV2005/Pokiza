import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL('https://pokiza-official-connect.akhmetova-n.chatgpt.site'),title:'POKIZA — Официальные контакты компании',description:'Все каналы связи и актуальные вакансии POKIZA в одном месте.',openGraph:{title:'POKIZA — Официальные контакты компании',description:'Все каналы связи и актуальные вакансии POKIZA в одном месте.',type:'website',locale:'ru_RU',alternateLocale:['tg_TJ','en_US'],images:[{url:'/hero.webp',width:1920,height:1280,alt:'POKIZA'}]},icons:{icon:'/pokiza-logo.png'},robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru" suppressHydrationWarning><body>{children}</body></html>}
