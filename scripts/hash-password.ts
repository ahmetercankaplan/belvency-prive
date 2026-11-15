/** Prints a scrypt hash for ADMIN_PASSWORD_HASH.  Usage: node scripts/hash-password.ts "my password" */
import { hashPassword } from "../server/auth.ts";

const pw = process.argv[2];
if (!pw || pw.length < 10) {
  console.error("Parol ən azı 10 simvol olmalıdır.\nİstifadə: node scripts/hash-password.ts \"parolunuz\"");
  process.exit(1);
}
console.log(await hashPassword(pw));
