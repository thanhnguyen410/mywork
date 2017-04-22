<?php

class Controller_Member extends Controller_Template
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

	public function action_index()
	{
		$data["subnav"] = array('index'=> 'active' );
		$this->template->title = 'Member &raquo; Index';
		$this->template->content = View::forge('member/index', $data);
	}

	public function action_login()
	{
		$data["subnav"] = array('login'=> 'active' );
		$this->template->title = 'Member &raquo; Login';
		$this->template->content = View::forge('member/login', $data);
	}

	public function action_logout()
	{
        Session::delete('info');
        Response::redirect('/');

		$data["subnav"] = array('logout'=> 'active' );
		$this->template->title = 'Member &raquo; Logout';
        $this->template->content = View::forge('member/logout', $data);
	} 

	public function action_register()
	{	 

        /*Gửi dữ liệu lên server */
		if(Input::method()=='POST'){

			$curl = Request::forge('http://chaythunghiem.esy.es/member/register','curl'); // Kết nối với server băng phương thức curl

			$curl->set_method('post'); // Chọn phươg thức lấy dữ liệu

			$values_member = array(
                'email' => Input::post('email'),
                'password' => base64_encode(Input::post('password')),
                'fullname' => Input::post('fullname'),
                'gender' => Input::post('gender'),
                'birthday' => Input::post('Bday').'-'.Input::post('Bmonth').'-'.Input::post('Byear'),
                'country_id' => Input::post('country'),
                'city_id' => Input::post('city'),
                'phone' => Input::post('telephone'),
                'address' => Input::post('address')
            );

            $curl->set_params($values_member);


            $result1 = $curl->execute();

            $result1 = $result1->response();

            $result1 = $result1->body;

            $result1 =json_decode($result1);

            if($result1->error==2){
                echo "Email đã tồn tại";
            }elseif($result1->error==1){
                echo "Lỗi vui lòng thử lại";
            }elseif($result1->error==0){
                echo "Vui lòng xác thực Email";
            }
                die;
    	 }

        /* Nhận dữ liệu từ server gửi xuống */

        $curl1 = Request::forge('http://chaythunghiem.esy.es/member/select_country','curl'); // Kết nối với server băng phương thức curl

        $curl1->set_method('get'); // Chọn phươg thức lấy dữ liệu

        $curl1->set_auto_format(true);

        $result = $curl1->execute();

        $result = $result->response();

        $result = $result->body;

        $data['result'] =json_decode($result);

        $this->template->title = 'Member &raquo; Register';
        $this->template->content = View::forge('member/register',$data);
    }

}
