require 'spec_helper'

describe Home do
  before(:each) do
    @valid_attributes = {
      :version => "value for version"
    }
  end

  it "should create a new instance given valid attributes" do
    Home.create!(@valid_attributes)
  end
end
