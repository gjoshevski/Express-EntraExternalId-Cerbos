/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import express from 'express';
const router = express.Router();
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

// custom middleware to check auth state
function isAuthenticated(req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/auth/signin'); // redirect to sign-in route
    }

    next();
};

router.get('/',
    isAuthenticated, // check if user is authenticated
    async function (req, res, next) {
        const posts = await prisma.post.findMany();
        console.log(posts);
        res.render('posts', {'posts': posts});
    }
);

router.post('/', async function (req, res, next) {
    const { title, content } = req.body;
    const body = {
        title,
        content,
        authorId : req.session.account.idTokenClaims.oid,
        organizationId : req.session.account.idTokenClaims.groups[0],
        
      };
    const post = await prisma.post.create({
        data: body,
      });

      return res.redirect('/posts');
    
});
    
        

export default router;
