# minigoose

Minigoose serves as a minimal alternative to the fully featured
[Mongoose](https://github.com/Automattic/mongoose). This package only provides
validation through a third party library ([Joi](https://github.com/hapijs/joi))
and uses + exposes the native
[mongo javascript driver](https://mongodb.github.io/node-mongodb-native/).

## Getting Started

```bash
npm install --save joi minigoose
```

First, you must create your model:

```js
const Joi = require('joi');
const {Model, Schema} = require('minigoose');

const UserModel = new Model('User', new Schema({
  id: Joi.string().required(),
  name: Joi.string().required(),
  roles: Joi.string().valid(['ADMIN', 'MODERATOR']),
  color: Joi.string().default('blue')
}));
```

And that's pretty much it! You can add any form of validations by referencing
the [Joi API](https://github.com/hapijs/joi/blob/v10.2.2/API.md). You can now
create new model's via the new constructor:

```js
let user = new UserModel({
  id: '2',
  name: 'Wyatt',
  roles: 'ADMIN'
});
```

Refer to `lib/model.js` file for other operations you can do by calling the
static methods on the Model.

## License

    MIT License

    Copyright (c) 2017 Wyatt Johnson

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
