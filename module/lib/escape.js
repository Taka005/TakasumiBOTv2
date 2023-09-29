module.exports = (str)=>{
  return str.replace(/[&'"<>]/g,(m)=>({
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
    "<": "&lt;",
    ">": "&gt;",
    "/": "&sol;"
  })[m]);
}