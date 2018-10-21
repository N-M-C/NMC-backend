# Plating API Server

## 새로운 API 서버가 필요해졌다.

문제점을 짚자면 

- 혼자서 서버를 다 만들던 개발자의 퇴사
- 웹버전 플레이팅을 개발하면서 보안의 강화가 필요해짐 
- 그러나 open api, admin api의 cors설정이 불분명하고 (get, post, put, update, .. and option?)
- 잘 못 설정을 건드리면 너무 많이 물려있어서 내부 운영툴이 터진다.
- 또한 api response값이 

새로운 API_V3 서버는 다음과 같은 룰을 따른다.

- 기존 php로 짜여진 api.plating.co.kr을 내리고 이 이름을 가진다.
- apiv2.plating.co.kr은 최대한 건드리지 않으며 proxy를 통해 api.plating.co.kr에 통합한다.
  - api.plating.co.kr/v2 (현재는 apialpha.plating.co.kr/v2) 로 기존 v2에 접근할 수 있다.
- 새로운 api는 도메인별로 버전을 갖는다. 업데이트의 용이함을 위해서다.
  - domain / version / restapi 
  - ex) v2/user/:id => user/v2/users/:id
  - [riot games api](https://developer.riotgames.com/api-methods/)를 참고
- api/ 폴더구조가 곧 endpoint 구조이다.
  - 이는 이해가 쉽다. 대신 유연함이 떨어진다. 새로운 개발자, 주니어들을 위해 이해가 쉬운 것을 택했다.
  - 자신이 백년만년 회사에 다닐 것이 아니라면 자신만 알 수 있는 구조는 그만한 document가 필요하고 충분한 인수인계가 필요하다.
  - 필요에 따라 폴더구조를 변경하길 바란다. 
- v2의 api에 validate나 새로운 기능들의 추가가 필요할 경우 최대한 v2를 활용하기위해서 v3는 v2의 route로 redirect 할 수도 있다.
  - ex) signup참고.

## 개발환경 설정

1. `git clone`

2. `yarn install`

3. .env 설정
   [create react app 의 env설정 방식](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-custom-environment-variables)을 가져왔다. 모든 컴퓨터의 환경 변경사항은 
   - .env
   - .env.development
   - .env.production
   - .env.test

   에 작성하고 이들은 git에 커밋된다.
   
   로컬 컴퓨터에서만 적용해야하는 환경은 

   - .env.local
   - .env.development.local
   - .env.production.local
   - .env.test.local

   에 작성하고 이들은 git에서 ignore된다.

4. `yarn dev` 를 하여 로컬환경에서 testdb에 연결된 dev서버가 잘 실행되는지 확인한다.

## 설계 방식

### controller (작성중)
 
constroller 설계는 몇가지 방법이 존재 한다. 

#### model을 다루는 기능만을 모듈화한다. 
``` js
const getUserById = require('./getUserById');
...
router.get('/', async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const result = await getUserById(userId);
  } catch (e) {
    ... 
  }
})

```

#### dependency injection을 통해 express.router를 인자로 받아 라우팅을 달아주는 함수로 만든다.
``` js
const addGetUserById = require('./getUserById');
...
addGetUserById(router)

```

#### 라우터의 콜백을 모듈화 한다.
``` js 
const getUserById = require('./getUserById');

router.get('/', getUserById);
```

```js
const getUserById = require('./getUserById');

router.post('/', async (req, res, next) => {
  const userId = req.body.userId;
  if (userId) {
    return getUserById(req, res, next);
  }
  
});
```

블록처럼 쌓기.

### models

#### controller(api/)와의 관계

model을 controller에 직접 사용하지 않고 service의 개념으로 한번 추상화하여 비정상적인 접근을 막을 수도 있지만, 
아직 초기상태의 프로젝트이고 이는 개발속도를 늦추거나 유연하지 않은 구조의 원인이 될 수 있다. 
보안상에 이슈가 없다면 sequelize model자체가 service의 역할을 하게하여 api controller에서 자유롭게 쓸 수 있게 두려고 하며
이처럼 느슨한 구조는 추후에 다음 개발자가 추상화 레이어를 만들고자 할 때도 무리없이 추가할 수 있을것이다.

#### sequelize 

알다시피 우리의 디비는 column값이 중구난방이며 camelCase이기도 하고 snake_case이기도 하고 id대신 idx를 쓰는 부분은 오타와 혼란을 주기 쉽다.
따라서 sequelize선언 부분에서 idx는 모두 id로, snake_case는 모두 camelCase로 alias하도록 한다. 

#### index.js

models/index.js를 보면 db객체를 생성해서 define된 모델에 넣어준다. 
``` js
const { menu } = require('src/models');
```
와
``` js
const menu = require('src/models/menu');
```
이 둘이 다르다는 것에 유의해야한다. 헷갈릴 위험을 방지하기 위해 `define/`폴더를 새로 생성하는 방식도 고려해볼만 하다.

선언 방식은 다른 몇가지를 생각할 수 있는데, `models/menu.js`를 예를 들면 
db객체를 function의 argument로 받지 않아도 `models/menu.js`에 바로 db를 `const db = require('src/db/sequelize');`해서 쓸 수도 있다.
혹은 sequelize model의 sync를 통해서 데이터를 가져올 수도 있다. 하지만 db를 argument로 받은 이유는 이후의 테스트를 위해서다. unit test를 등을 위해
model define과 db객체의 선언을 분리하는 것이 유리할 것이다.

또한 model간의 관계도 index.js에 적는다. 

## Test

mocha로 테스트를 작성해 보았지만 이를 충분히 사용하고 있지는 않다. **src/tests/**, **.env.test**, **.sequelizerc**, **config/db.js**를 참고해보면 좋다. 
test파일은 api에 각 endpoint에 위치해도 좋다.

## logging 

매우 빠른, pino를 사용한다. 

## TODO

- 도메인에 대한 고민.