---
title: HTTP Status Code
excerpt: http 상태 코드에 대해서 알아봅시다
category: dev
thumbnail: 418.jpg
createdAt: 2022-03-18T07:35:12.184Z
---
# HTTP 상태 코드 (HTTP Status Code)

웹 브라우저가 서버에 http 요청을 할 경우, 성공 혹은 실패 여부 및 다음 행동으로 무엇을 해야 하는지 알려주는 상태 코드이다.

그룹은 5개 그룹으로 나누어 진다.

# 100번대 (Information): 정보 응답
* 100 (continue): 서버가 request header는 받았고, 클라이언트가 request body를 보내고 있는 상태
* 101 (switching protocols): 요청자가 서버에게 switching protocol 을 묻는 상태
* 102 (processing): 요청자가 서버에게 요청 하였고, 서버가 이를 처리하였지만 응답이 없는 상태
* 103 (checkpoint): 중단된 Put과 Post 요청을 되찾을 수 있는 request를 사용하는 상태

# 200번대 (Successful): 성공 응답
* 200 (ok): 에러없이 성공이 완료된 상태
* 201 (created): request가 되었고, 요청을 바탕으로 새로운 자원이 만들어진 상태
* 202 (accepted): 서버가 request를 전송 받았으나, 현재 완전하게 처리되지 않은 상태
* 203 (non-authoritative information): 서버가 클라이언트 요구 중 일부만 전달한 상태
* 204 (no content): request 요청을 처리 후 클라이언트에게 전달 할 컨텐츠가 없는 상태. 주로 삭제 요청 후 status code로 쓰인다.
* 205 (reset content): no content 상태라서 클라이언트의 뷰가 reset이 필요한 상태
* 206 (partial content): 클라이언트의 header 범위 문제로 서버가 자원의 일부만을 전달**받은** 상태
* 207 (multi-status): 멀티-상태 응답은 다수의 리소스가 여러 개의 상태 코드인 상황이 적절한 경우에 해당되는 정보를 서비스에 전달한 상태 (*사실 무슨 말인지 잘 모르겠다*)
* 208 (multi-status): 멀티-상태 읍응답 DAV에서 사용, propstat(property와 status의 합성어) 응답 속성으로 동일 컬렉션으로 바인드된 복수의 내부 멤버를 반복적으로 열거하는 것을 피하기 위해 사용하는 상태 (*사실 무슨 말인지 잘 모르겠다*)
* 226 (IM Used): 서버가 GET 요청에 대한 리소스를 처리했으며, 응답이 하나 또는 그 이상의 인스턴스 조작이 현재 인스턴스에 적용이 되었음을 알리는 상태

# 300번대 (Redirection): 리다이렉션 응답
* 300 (Multiple Choices): 최대 다섯개의 링크를 골라서 이동할 수 있는 상태
* 301 (permanently moved): 요청된 페이지가 새로운 URL로 이동 된 상태
* 302 (found): 요청된 페이지가 일시적으로 새 URL로 이동 된 상태
* 303 (see other): 요청된 페이지는 다른 URL에서 찾을 수 있는 상태
* 304 (not modified): 마지막 요청 이후 수정되지 않은 상태
* 305 (use proxy): location 필드에 proxy의 URL을 사용하는 상태
* 306 (switch proxy): 사용하지 않는 코드
* 307: Temporary Redirect 302 Found HTTP 응답 코드와 동일한 의미를 가지고 있으며, 사용자 에이전트가 반드시 사용된 HTTP 메소드를 변경하지 말아야 하는 점만 다른 상태
* 308: Permanent Redirect 301 Moved Permanently HTTP 응답 코드와 동일한 의미를 가지고 있으며, 사용자 에이전트가 반드시 HTTP 메소드를 변경하지 말아야 하는 점만 다른 상태

# 400번대 (Client Error): 클라이언트 에러 응답
* 400 (Bad Request): 요청에 대한 문법적 오류가 있어서 서버가 이해할 수 없는 상태. 주로 전달 받은 요청의 자원의 불충분함을 나타낼 때 쓴다.
* 401 (Unauthorized): 특정 요청이 인증이 되지 않아서 권한이 없는 상태
* 402 (Payment Required): 최신 status code 인데 아직 쓰지 않는 걸로 알고 있음. 추후 payment 서비스에서 결제를 요할때 쓰는 것으로 알고 있다.
* 403 (Forbidden): 요청이 인증은 되었지만, 요청한 자원에 대해서는 접근 할 권한이 없는 상태. 401은 인증이 되지 않아서 누구인지 모르는 상태이지만 403는 인증은 되어서 요청자가 누구인지는 알고 있으나 요청한 자원에 대한 권한은 없음을 알리는 상태이다.
* 404 (NotFound): 요청한 자원을 찾을 수 없는 상태
* 405 (Method Not Allowed): 요청의 method가 제공되지 않은 상태
* 406 (Not Acceptable): request에서 accept header에 not acceptable의 내용을 가진 자원을 요청한 상태
* 407 (Proxy Authentication Required): 프록시 서버에게 해당 요청이 수행되도록 인증을 받아야 하는 상태
* 408 (Request Timeout): 요청 대기시간이 지난 상태
* 409 (Conflict): request 충돌로 인해서 요청이 완료되지 않은 상태, 생성 요청인데 이미 생성되어 있는 상태
* 410 (Gone): 요청 페이지는 더 이상 사용할 수 없는 상태
* 411 (Length Required): Content-Length 부분이 빠져서 요청을 허가하지 않은 상태
* 412 (Precondition Failed): request 헤더 필드에 선결 조건에 대한 값이 서버에서 false가 나온 경우
* 413 (Request entity too large): 요청 엔티티를 서버가 처리하기에 너무 큰 상태
* 414 (Request-URI Too Long): 요청 URI가 너무 긴 상태
* 415 (Unsupported Media Type): 지원하지 않는 미디어 타입을 요청한 상태
* 416 (Requested Range Not Satisfiable): 클라이언트가 파일의 일부를 요청했을 때 서버가 지원하지 않는 상태
* 417 (Expectation Failed): Expect request-header 필드의 요구를 서버가 충족시킬 수 없는 상태
* 418 (im a teapot): HTTP 418 I'm a teapot 클라이언트 오류 응답 코드는 서버가 찻주전자이기 때문에 커피 내리기를 거절했다는 것을 의미합니다. 이 오류는 1998년 만우절 농담이었던 하이퍼 텍스트 커피 포트 제어 규약(Hyper Text Coffee Pot Control Protocol)의 레퍼런스입니다.
* 422 (Unprocessable Entity): 요청은 잘 전달 됐지만, 문법 오류가 난 상태
* 429 (Too Many Requests): 사용자가 지정된 시간에 너무 많은 요청을 보낸 상태

# 500번대 (Server Error): 서버 에러 응답
* 500 (Internal Server Error): 포괄적인 서버 에러 메시지, 서버가 에러가 왜 났는지 어떻게 처리해야하는지 아직 모르는 상태. 서버 측에서 특정 에러에 대한 핸들링이 되어있지 않다.
* 501 (Not Implemented): 서버가 해당 요청 메소드를 인식 못하거나, 이행할 능력이 없는 상태
* 502 (Bad Gateway): 게이트웨이나 프록시의 상태가 나쁘거나 과부하인 상태
* 503 (Service Unavailable): 일시적으로 서비스가 사용 불가능 한 상태, (임시 조건에 사용되어야 하며, Retry-After: HTTP 헤더는 가능하면 서비스를 복구하기 전 예상 시간을 포함해야 함)
* 504 (Gateway Timeout): 과부하 등의 이유로 게이트웨이나 프록시의 한계 대기 시간이 지난 상태
* 505 (HTTP Version Not Supported): request에서 사용한 HTTP 프로토콜을 서버가 지원하지 않는 상태
* 511 (Network Authentication Required): 클라이언트의 접근을 위한 네트워크 인증이 필요한 상태

> 참고자료
http://www.incodom.kr/Status_code
https://developer.mozilla.org/ko/docs/Web/HTTP/Status/418



