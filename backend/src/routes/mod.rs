mod users;
mod auth;
mod crm;
mod test;

use actix_web::web::ServiceConfig;
use serde::Serialize;

use users::users;
use auth::auth;
use crm::crm;
use test::test;


#[derive(Serialize)]
pub struct Response<T> {
    code: u16,
    message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    data: Option<T>
}

impl<T> Response<T> {
    pub fn ok(message: &str, data: Option<T>) -> Self where T: Serialize {
        Response {
            code: 200,
            message: message.to_string(),
            data
        }
    }

    pub fn internal_server_error(reason: &str) -> Self {
        Response {
            code: 500,
            message: reason.to_string(),
            data: None
        }
    }

    pub fn bad_request(reason: &str) -> Self {
        Response {
            code: 400,
            message: reason.to_string(),
            data: None,
        }
    }

    pub fn created(message: &str) -> Self {
        Response {
            code: 201,
            message: message.to_string(),
            data: None
        }
    }

    pub fn not_found(reason: &str) -> Self {
        Response {
            code: 404, 
            message: reason.to_string(), 
            data: None
        }
    }



}


pub fn routes(conf: &mut ServiceConfig) {
    conf.service(auth());
    conf.service(users());
    conf.service(crm());
    conf.service(test());
}