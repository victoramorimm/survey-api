import { Hasher } from '../../data/protocols/criptography/Hasher'
import bcrypt from 'bcrypt'
import { HashComparer } from '../../data/protocols/criptography/HashComparer'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)

    return hash
  }

  async compare (value: string, hashToCompare: string): Promise<boolean> {
    await bcrypt.compare(value, hashToCompare)
    return true
  }
}
