
export default function isEmptyObject(object : Object) {
  if(JSON.stringify(object) === "{}") return true;
  return false;
}

