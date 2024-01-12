use actix_web::{Scope, web::{self, ReqData}, Responder, HttpResponse, post, delete, dev::{ServiceRequest, ServiceFactory, ServiceResponse}, body::{EitherBody, BoxBody}, Error};
use actix_web_httpauth::middleware::HttpAuthentication;
use serde::{Serialize, Deserialize};
use uuid::Uuid;

use crate::{AppState, controllers::{crm::CRM, jwt::Claims}, routes::Response};
use crate::middleware::user_middleware::validator;


pub fn crm() -> Scope<impl ServiceFactory<ServiceRequest, Config = (), Response = ServiceResponse<EitherBody<BoxBody>>, Error = Error, InitError = ()>> {
    let user_auth_middleware = HttpAuthentication::bearer(validator);
    
    let scope = web::scope("/crm")
        .wrap(user_auth_middleware)
        .route("", web::get().to(index))
        .route("/", web::get().to(index))
        .service(create_crm)
        .service(remove_by_uuid);
        
    scope
}

async fn index() -> impl Responder {
    HttpResponse::Ok().body("crm route")
} 


#[post("/create")]
async fn create_crm(data: web::Data<AppState>, req_user: Option<ReqData<Claims>>) -> impl Responder {

    let user = &req_user.unwrap().user;

    //todo: get number of crm's the user has and check if user is allowed to create a new one

    //user is allowed to create a new crm:
    let new_crm = CRM::new(&data, &user).await;

    match new_crm {
        Err(err) => HttpResponse::InternalServerError().json(Response::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Created().json(Response::created("Success! New CRM created."))
    }
}


#[derive(Serialize, Deserialize)]
struct DeleteBodyRequest {
    uuid: Uuid,
}

#[delete("/")]
async fn remove_by_uuid(data: web::Data<AppState>, body: web::Json<DeleteBodyRequest>) -> impl Responder {
    
    
    //todo! only an admin or a user that is the owner of the crm should be able to remove


    match CRM::remove_by_uuid(&data, &body.uuid).await {
        Err(err) => HttpResponse::InternalServerError().json(Response::internal_server_error(&err.to_string())),
        Ok(_) => HttpResponse::Ok().json(Response::ok("Deleted successfully", None, None))
    }

}

