import express = require('express');
import Knex = require('knex');

declare global {
  namespace Express {
    export interface Request {
      token: any;
      db: Knex;
      decoded: any
    }
  }
}