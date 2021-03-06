import {default as mongo} from '../services/mongoService'
import { InsertOneWriteOpResult } from 'mongodb';

export function saveUser (user) {
  return mongo.create({ _id: user }, 'users')
}

export function findUser (user) {
  return mongo.readOne({ _id: user }, 'users')
}