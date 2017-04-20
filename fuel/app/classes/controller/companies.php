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
				'fax'=>Input::post('fax')
			);

			$curl->set_params($values_company);

			$result = $curl->execute();

			// $result1 = $result->
			print_r($result);
			die;
		}


		$data["subnav"] = array('register'=> 'active' );
		$this->template->title = 'Companies &raquo; Register';
		$this->template->content = View::forge('companies/register', $data);
	}

}
