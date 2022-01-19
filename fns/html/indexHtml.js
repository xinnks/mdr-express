const indexHtml = `
<!DOCTYPE html>
<html>

<head>
  <title>My Daily Reads</title>
  <meta name="description" content="Get customized dev content for your reading delivered to your inbox daily.">
  
  <style>
    /*! tailwindcss v3.0.11 | MIT License | https://tailwindcss.com*/*,:after,:before{box-sizing:border-box;border:0 solid}:after,:before{--tw-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:initial}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background-color:initial;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:initial}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input:-ms-input-placeholder,textarea:-ms-input-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}*,:after,:before{--tw-ring-inset:var(--tw-empty,/*!*/ /*!*/);--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000}.col-span-3{grid-column:span 3/span 3}.col-span-2{grid-column:span 2/span 2}.col-start-2{grid-column-start:2}.col-start-3{grid-column-start:3}.col-start-1{grid-column-start:1}.m-0{margin:0}.m-8{margin:2rem}.m-2{margin:.5rem}.m-6{margin:1.5rem}.m-4{margin:1rem}.mx-auto{margin-left:auto;margin-right:auto}.mx-20{margin-left:5rem;margin-right:5rem}.mx-10{margin-left:2.5rem;margin-right:2.5rem}.mt-4{margin-top:1rem}.flex{display:flex}.table{display:table}.grid{display:grid}.hidden{display:none}.h-20{height:5rem}.h-8{height:2rem}.h-10{height:2.5rem}.w-full{width:100%}.w-20{width:5rem}.max-w-sm{max-width:24rem}.max-w-lg{max-width:32rem}.max-w-md{max-width:28rem}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.place-content-around{place-content:space-around}.items-center{align-items:center}.justify-center{justify-content:center}.justify-around{justify-content:space-around}.gap-2{gap:.5rem}.gap-8{gap:2rem}.gap-3{gap:.75rem}.space-y-2>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(.5rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.5rem*var(--tw-space-y-reverse))}.space-y-6>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1.5rem*(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1.5rem*var(--tw-space-y-reverse))}.rounded-xl{border-radius:.75rem}.rounded-sm{border-radius:.125rem}.rounded-md{border-radius:.375rem}.rounded{border-radius:.25rem}.border-cyan-900{--tw-border-opacity:1;border-color:rgb(22 78 99/var(--tw-border-opacity))}.border-cyan-700{--tw-border-opacity:1;border-color:rgb(14 116 144/var(--tw-border-opacity))}.border-gray-800{--tw-border-opacity:1;border-color:rgb(31 41 55/var(--tw-border-opacity))}.border-gray-700{--tw-border-opacity:1;border-color:rgb(55 65 81/var(--tw-border-opacity))}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.bg-sky-100{--tw-bg-opacity:1;background-color:rgb(224 242 254/var(--tw-bg-opacity))}.bg-cyan-700{--tw-bg-opacity:1;background-color:rgb(14 116 144/var(--tw-bg-opacity))}.bg-sky-50{--tw-bg-opacity:1;background-color:rgb(240 249 255/var(--tw-bg-opacity))}.bg-gray-800{--tw-bg-opacity:1;background-color:rgb(31 41 55/var(--tw-bg-opacity))}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.p-0{padding:0}.p-8{padding:2rem}.p-4{padding:1rem}.p-2{padding:.5rem}.py-8{padding-top:2rem;padding-bottom:2rem}.px-8{padding-left:2rem;padding-right:2rem}.align-middle{vertical-align:middle}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.font-bold{font-weight:700}.text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.shadow-lg{--tw-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);--tw-shadow-colored:0 10px 15px -3px var(--tw-shadow-color),0 4px 6px -4px var(--tw-shadow-color)}.shadow-lg,.shadow-sm{box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 2px 0 rgba(0,0,0,.05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color)}.shadow-slate-400{--tw-shadow-color:#94a3b8;--tw-shadow:var(--tw-shadow-colored)}.shadow-slate-500{--tw-shadow-color:#64748b;--tw-shadow:var(--tw-shadow-colored)}.ring-2{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000)}.ring-gray-700{--tw-ring-opacity:1;--tw-ring-color:rgb(55 65 81/var(--tw-ring-opacity))}.ring-gray-500{--tw-ring-opacity:1;--tw-ring-color:rgb(107 114 128/var(--tw-ring-opacity))}.ring-gray-600{--tw-ring-opacity:1;--tw-ring-color:rgb(75 85 99/var(--tw-ring-opacity))}.hover\:bg-sky-100:hover{--tw-bg-opacity:1;background-color:rgb(224 242 254/var(--tw-bg-opacity))}.hover\:bg-gray-800:hover{--tw-bg-opacity:1;background-color:rgb(31 41 55/var(--tw-bg-opacity))}@media (min-width:640px){.sm\:py-4{padding-top:1rem;padding-bottom:1rem}}
  </style>
</head>

<body>
  <div style="min-height: 100vh;" class="p-0 m-0 w-full bg-gray-200">

    <main class="flex flex-col items-center justify-around py-8 px-8">

      <h1 class="p-8 m-6 text-4xl font-bold">
        My Daily Reads
      </h1>

      <p class="p-4 m-4 width-full text-xl">
        Get customized dev content for your reading delivered to your inbox daily.
      </p>

      <div class="flex flex-row items-center justify-center p-4 m-4 width-full">
        <div class="mx-10 p-8 bg-sky-50 hover:bg-sky-100 rounded shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" aria-label="dev.to" role="img" viewBox="0 0 512 512" class="h-20 w-20">
            <title>Dev.to</title>
            <rect width="512" height="512" rx="15%"/>
            <path d="m 140.47,203.94 h -17.44 v 104.47 h 17.45 c 10.15529,-0.54503 17.35752,-8.66899 17.47,-17.41 v -69.65 c -0.69578,-10.36382 -7.79596,-17.27188 -17.48,-17.41 z m 45.73,87.25 c 0,18.81 -11.61,47.31 -48.36,47.25 H 91.44 V 172.98 h 47.38 c 35.44,0 47.36,28.46 47.37,47.28 z M 286.88,202.53 H 233.6 v 38.42 h 32.57 v 29.57 H 233.6 v 38.41 h 53.29 v 29.57 h -62.18 c -11.16,0.29 -20.44,-8.53 -20.72,-19.69 V 193.7 c -0.27,-11.15 8.56,-20.41 19.71,-20.69 h 63.19 z m 103.64,115.29 c -13.2,30.75 -36.85,24.63 -47.44,0 l -38.53,-144.8 h 32.57 l 29.71,113.72 29.57,-113.72 h 32.58 z" fill="#fff"/></svg>
        </div>
        <!-- <div class="mx-10 p-8 bg-sky-50 hover:bg-sky-100 rounded shadow-sm">
          <svg width="337" height="337" viewBox="0 0 337 337" fill="none" class="h-20 w-20">
            <title>Hashnode</title>
            <rect x="113" y="113" width="111" height="111" rx="55.5" fill="white"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M23.155 112.598c-30.873 30.874-30.873 80.93 0 111.804l89.443 89.443c30.874 30.873 80.93 30.873 111.804 0l89.443-89.443c30.873-30.874 30.873-80.93 0-111.804l-89.443-89.443c-30.874-30.873-80.93-30.873-111.804 0l-89.443 89.443zm184.476 95.033c21.612-21.611 21.612-56.651 0-78.262-21.611-21.612-56.651-21.612-78.262 0-21.612 21.611-21.612 56.651 0 78.262 21.611 21.612 56.651 21.612 78.262 0z" fill="#2962FF"/>
            </svg>
        </div> -->
      </div>

      <div
        class="flex flex-col p-4 m-4 max-w-lg mx-auto bg-white rounded-xl shadow-lg sm:py-4">
        <p class="p-4 max-w-lg">
          Provide us with your name, email and two keywords to get dev content from the above sources tailored to you.
        </p>

        <form action="/subscribe" method="post" class="grid grid-cols-4 grid-rows-auto gap-3 place-content-around p-4 m-4">

          <label for="name" class="col-start-1">Name: </label>
          <input type="text" name="name" class="col-start-2 col-span-3 h-8 p-4 rounded-sm border-sm ring-2 ring-gray-500" required>

          <label for="email" class="col-start-1">Email: </label>
          <input type="email" name="email" class="col-start-2 col-span-3 h-8 p-4 rounded-sm border-sm ring-2 ring-gray-500" required>

          <label for="keywords" class="col-start-1">Keywords: </label>
          <input type="text" name="keywords" placeholder="javascript, rust" class="col-start-2 col-span-3 h-8 p-4 rounded-sm border-sm ring-2 ring-gray-500" required>

          <button type="submit" class="col-start-2 col-span-2 h-10 p-2 rounded-md border-gray-700 bg-gray-700 hover:bg-gray-800 text-white ring-2 ring-gray-500 mt-4">SUBMIT</button>
        
        </form>
      </div>

    </main>

  </div>
</body>

</html>
`;

module.exports = {
  indexHtml
}