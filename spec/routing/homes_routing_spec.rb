require 'spec_helper'

describe HomesController do
  describe "routing" do
    it "recognizes and generates #index" do
      { :get => "/homes" }.should route_to(:controller => "homes", :action => "index")
    end

    it "recognizes and generates #new" do
      { :get => "/homes/new" }.should route_to(:controller => "homes", :action => "new")
    end

    it "recognizes and generates #show" do
      { :get => "/homes/1" }.should route_to(:controller => "homes", :action => "show", :id => "1")
    end

    it "recognizes and generates #edit" do
      { :get => "/homes/1/edit" }.should route_to(:controller => "homes", :action => "edit", :id => "1")
    end

    it "recognizes and generates #create" do
      { :post => "/homes" }.should route_to(:controller => "homes", :action => "create") 
    end

    it "recognizes and generates #update" do
      { :put => "/homes/1" }.should route_to(:controller => "homes", :action => "update", :id => "1") 
    end

    it "recognizes and generates #destroy" do
      { :delete => "/homes/1" }.should route_to(:controller => "homes", :action => "destroy", :id => "1") 
    end
  end
end
