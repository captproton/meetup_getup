require 'spec_helper'

describe HomesController do

  def mock_home(stubs={})
    @mock_home ||= mock_model(Home, stubs)
  end

  describe "GET index" do
    it "assigns all homes as @homes" do
      Home.stub(:find).with(:all).and_return([mock_home])
      get :index
      assigns[:homes].should == [mock_home]
    end
  end

  describe "GET show" do
    it "assigns the requested home as @home" do
      Home.stub(:find).with("37").and_return(mock_home)
      get :show, :id => "37"
      assigns[:home].should equal(mock_home)
    end
  end

  describe "GET new" do
    it "assigns a new home as @home" do
      Home.stub(:new).and_return(mock_home)
      get :new
      assigns[:home].should equal(mock_home)
    end
  end

  describe "GET edit" do
    it "assigns the requested home as @home" do
      Home.stub(:find).with("37").and_return(mock_home)
      get :edit, :id => "37"
      assigns[:home].should equal(mock_home)
    end
  end

  describe "POST create" do

    describe "with valid params" do
      it "assigns a newly created home as @home" do
        Home.stub(:new).with({'these' => 'params'}).and_return(mock_home(:save => true))
        post :create, :home => {:these => 'params'}
        assigns[:home].should equal(mock_home)
      end

      it "redirects to the created home" do
        Home.stub(:new).and_return(mock_home(:save => true))
        post :create, :home => {}
        response.should redirect_to(home_url(mock_home))
      end
    end

    describe "with invalid params" do
      it "assigns a newly created but unsaved home as @home" do
        Home.stub(:new).with({'these' => 'params'}).and_return(mock_home(:save => false))
        post :create, :home => {:these => 'params'}
        assigns[:home].should equal(mock_home)
      end

      it "re-renders the 'new' template" do
        Home.stub(:new).and_return(mock_home(:save => false))
        post :create, :home => {}
        response.should render_template('new')
      end
    end

  end

  describe "PUT update" do

    describe "with valid params" do
      it "updates the requested home" do
        Home.should_receive(:find).with("37").and_return(mock_home)
        mock_home.should_receive(:update_attributes).with({'these' => 'params'})
        put :update, :id => "37", :home => {:these => 'params'}
      end

      it "assigns the requested home as @home" do
        Home.stub(:find).and_return(mock_home(:update_attributes => true))
        put :update, :id => "1"
        assigns[:home].should equal(mock_home)
      end

      it "redirects to the home" do
        Home.stub(:find).and_return(mock_home(:update_attributes => true))
        put :update, :id => "1"
        response.should redirect_to(home_url(mock_home))
      end
    end

    describe "with invalid params" do
      it "updates the requested home" do
        Home.should_receive(:find).with("37").and_return(mock_home)
        mock_home.should_receive(:update_attributes).with({'these' => 'params'})
        put :update, :id => "37", :home => {:these => 'params'}
      end

      it "assigns the home as @home" do
        Home.stub(:find).and_return(mock_home(:update_attributes => false))
        put :update, :id => "1"
        assigns[:home].should equal(mock_home)
      end

      it "re-renders the 'edit' template" do
        Home.stub(:find).and_return(mock_home(:update_attributes => false))
        put :update, :id => "1"
        response.should render_template('edit')
      end
    end

  end

  describe "DELETE destroy" do
    it "destroys the requested home" do
      Home.should_receive(:find).with("37").and_return(mock_home)
      mock_home.should_receive(:destroy)
      delete :destroy, :id => "37"
    end

    it "redirects to the homes list" do
      Home.stub(:find).and_return(mock_home(:destroy => true))
      delete :destroy, :id => "1"
      response.should redirect_to(homes_url)
    end
  end

end
