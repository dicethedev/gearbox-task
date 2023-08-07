import { redirect } from "next/navigation";
import home from './home/page'

export default function Home() {
  return redirect("/home"); 
}