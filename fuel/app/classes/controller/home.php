<?php

class Controller_Home extends Controller_Template
{	
	public function before(){ // Hàm bắt đầu chạy controller. Kiểm tra xem có secction tiếng việt nếu co thì lòad
		parent::before();
		if(Session::get('vi')){
			Config::set('language','vi');
			Lang::load('vi');
		}else{ // Nếu không sẽ load phiên ngôn ngữ tiếng anh
			Lang::load('en');
		}
	}

	public function action_lang($lang=null){  // Nếu người dùng click vào Nút chuyển đổi ngôn ngữ thì sẽ kiếm tra $lang (sesgment ở url) có tồn tại không, nếu tồn tại 'vi' thì load tiếng việt, còn ko đúng vi thì load ngôn ngữ tiếng anh và delete phiên của tiếng việt
		if($lang=='vi'){
			Session::set('vi','1');
		}elseif($lang!=null){
			Session::delete('vi');
		}
		Response::redirect('/');
	}

	public function action_index()
	{
		if(Input::method()=='POST'){
			if(Security::check_token()){
				$curl = Request::forge('http://chaythunghiem.esy.es/member/login','curl'); // Kết nối với server băng phương thức curl

				$curl->set_method('get'); // Chọn phươg thức lấy dữ liệu
 
				$curl->http_login('admin','admin','BASIC'); // Nhập tài khoản admin

				$curl->set_params(array('email'=>Input::post('email'),'password'=>base64_encode(Input::post('password')))); // lấy Dữ liệu từ form

				$result = $curl->execute();

				$result[''] = json_decode($result);

				// print_r($result);
				// die;

				if(isset($result->id)){
					Session::set('info',$result);
				}

			}else{
				Response::redirect('/');
			}
		}

		$data["subnav"] = array('index'=> 'active' );
		$this->template->title = 'Home &raquo; Index';
		$this->template->content = View::forge('home/index', $data);
	}

}

// mataithe11@yahoo.com.vn
// Pass vietnam