<?php

class Controller_Companies extends Controller_Template
{

	public function before(){
		parent::before();
		if(Session::get('vi')){
			Config::set('language','vi');
			Lang::load('vi');
		}else{
			Lang::load('en');
		}
	}

	public function action_login()
	{
		if(Input::method() == 'POST'){
			$curl = Request::forge('http://chaythunghiem.esy.es/company/login','curl');
			$curl->set_method('post');

			$curl->set_params(array('email'=>Input::post('email'),'password'=>base64_encode(Input::post('password'))));

			$result = $curl->execute();

			$result = json_decode($result);

			if(isset($result->id)){
				Session::set('info_company',$result);
				Response::redirect('/');
			}else{
				echo "Đăng nhập thất bại";
			}
		}


		$data["subnav"] = array('login'=> 'active' );
		$this->template->title = 'Companies &raquo; Login';
		$this->template->content = View::forge('companies/login', $data);
	}


	public function action_register()
	{
		if(Input::method()=='POST'){

			$curl = Request::forge('http://chaythunghiem.esy.es/company/register','curl');
			$curl->set_method('post'); // Chọn phương thức lấy dữ liệu

			$values_company = array(
				'email'=>Input::post('email'),
				'password'=>base64_encode(Input::post('password')),
				'company'=>Input::post('company_name'),
				'address'=>Input::post('company_address'),
				'city_id'=>Input::post('city'),
				'scale'=>Input::post('company_size'),
				'description'=>Input::post('company_description'),
				'website'=>Input::post('website'),
				'phone'=>Input::post('telephone'),
				'fax'=>Input::post('fax'),
				'con_email'=>Input::post('con_email'),
				'con_fullname'=>Input::post('con_fullname'),
				'con_position'=>Input::post('con_position'),
				'con_phone'=>Input::post('con_phone')
			);

			$curl->set_params($values_company);

			$result = $curl->execute();

			$result = $curl->response();

			$result = $result->body;

			$result = json_decode($result);

		}

		$curl_sub = Request::forge('http://chaythunghiem.esy.es/member/select_country','curl');
		$curl_sub->set_method('get');

		$result_sub = $curl_sub->execute();

		$result_sub = $result_sub->response();

		$result_sub = $result_sub->body;

		$data['result_con'] = json_decode($result_sub);

		$data["subnav"] = array('register'=> 'active' );
		$this->template->title = 'Companies &raquo; Register';
		$this->template->content = View::forge('companies/register', $data);
	}

}
