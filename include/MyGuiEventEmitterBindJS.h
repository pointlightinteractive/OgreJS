
#ifndef MYGUI_EVENT_EMITTER_BIND_JS
#define MYGUI_EVENT_EMITTER_BIND_JS

#include <node_object_wrap.h>
#include <MyGUI.h>
#include <v8.h>


class MyGuiEventEmitterBindJS : public node::ObjectWrap
	{
	public:
	
	 void initMyGuiEventEmitterBindJS( MyGUI::Widget* widget ) 
		{
			printf( "bound myguieventemitter\n") ;
		 widget-> eventMouseButtonPressed += MyGUI::newDelegate( static_cast<MyGuiEventEmitterBindJS*>(this), &MyGuiEventEmitterBindJS::mouseButtonPressed ) ;

		// widget-> eventMouseMove += MyGUI::newDelegate( this, &MyGuiEventEmitterBindJS::mouseMove ) ;	
		}
		
	 void mouseButtonPressed( MyGUI::Widget* _sender, int _left, int _top, MyGUI::MouseButton _id ) ;

	 virtual void mouseMove( MyGUI::Widget* _sender, int _left, int _top ) ;
	 

	// PRIVATE
		
	 void emit( char* eventType, v8::Local<v8::Value> arg ) ;	
	} ;
	
#endif