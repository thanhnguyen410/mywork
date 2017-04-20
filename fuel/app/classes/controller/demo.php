<?php

class Controller_Demo extends Controller_Template
{

	public function before(){ // Hàm sẽ lòad trước khi vào template
		parent::before();
		if(!Session::get('info')){
			Response::redirect('/');
		}
	}

	public function action_index()
	{


		if(Session::get('info')){

			// Truy vấn đếm số lượt xem
			// $a = Model_Static::find('first',array(
			// 	'where'=>array(array(array('member_id','=',$jobapp->member_id)))));
			// $a->company_view +=1;
			// $a->save();

				$data['values'] = Session::get('info');

		};

		$data["subnav"] = array('index'=> 'active' );
		$this->template->title = 'Demo &raquo; Index';
		$this->template->content = View::forge('demo/index', $data);
	}

}
