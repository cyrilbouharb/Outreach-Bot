'use client'
import Image from "next/image";
import comingImg from '../../public/cm.webp'
import logo from "../../public/logo.png";

export default function Profile() {
  const coming = require('../../public/logo.png')
  return (
    <Image src={comingImg} width={1700} alt='coming soon'/>
  )
}
