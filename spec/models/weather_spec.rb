require 'spec_helper'

module WeatherSpecHelper
  def valid_weather_attributes
    {
      :zipcode => 11111,
      :city => "value for city",
      :zipcode => "value for zipcode",
      :city => "value for city",
      :region => "value for region",
      :country => "value for country",
      :temperature_high => "value for temperature_high",
      :temperature_low => "value for temperature_low",
      :temperature_units => "value for temperature_units",
      :link => "value for link",
      :recorded_at => Date.today,
      :created_at => Time.now,
      :updated_at => Time.now      
    }
  end
end
describe Weather do
  
  include WeatherSpecHelper
  before(:each) do
    @weather = Weather.new

  end

  it "should be valid" do    
    @weather.attributes = valid_weather_attributes
    @weather.should be_valid
  end
  
  it do
    @weather.should have(1).error_on(:zipcode)
  end
  
  it "should create a new instance given valid attributes" do
    # Weather.create!(@valid_attributes)
  end
end
