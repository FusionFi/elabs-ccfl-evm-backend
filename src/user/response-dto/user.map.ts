export function mapUser(obj: any) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      delete obj[i]['id'];
      delete obj[i]['password'];
      delete obj[i]['emailVerified'];
      delete obj[i]['isActive'];
      delete obj[i]['createdAt'];
      delete obj[i]['updatedAt'];
    }
  } else {
    delete obj['id'];
    delete obj['password'];
    delete obj['emailVerified'];
    delete obj['isActive'];
    delete obj['createdAt'];
    delete obj['updatedAt'];
  }

  return obj;
}
