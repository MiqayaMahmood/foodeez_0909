// 'use client'

// import React from 'react'

// const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
// const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

// async function getStrapiFiles() {
//   const res = await fetch(`${STRAPI_URL}/api/upload/folders`, {
//     headers: {
//       Authorization: `Bearer ${STRAPI_API_TOKEN}`,
//     },
//   });
//   const data = await res.json();
//   console.log(data);
// }

// const page = async () => {
//   await getStrapiFiles();
//   return (
//     <div>
//         <button onClick={() => getStrapiFiles()}>Get Strapi Files</button>

//     </div>
//   )
// }

// export default page

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page