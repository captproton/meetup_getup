class WeathersController < ApplicationController
  # GET /weathers
  # GET /weathers.xml
  def index
    @weathers = Weather.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @weathers }
    end
  end

  # GET /weathers/1
  # GET /weathers/1.xml
  def show
    @weather = Weather.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @weather }
    end
  end

  # GET /weathers/new
  # GET /weathers/new.xml
  def new
    @weather = Weather.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @weather }
    end
  end

  # GET /weathers/1/edit
  def edit
    @weather = Weather.find(params[:id])
  end

  # POST /weathers
  # POST /weathers.xml
  def create
    @weather = Weather.new(params[:weather])

    respond_to do |format|
      if @weather.save
        format.html { redirect_to(@weather, :notice => 'Weather was successfully created.') }
        format.xml  { render :xml => @weather, :status => :created, :location => @weather }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @weather.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /weathers/1
  # PUT /weathers/1.xml
  def update
    @weather = Weather.find(params[:id])

    respond_to do |format|
      if @weather.update_attributes(params[:weather])
        format.html { redirect_to(@weather, :notice => 'Weather was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @weather.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /weathers/1
  # DELETE /weathers/1.xml
  def destroy
    @weather = Weather.find(params[:id])
    @weather.destroy

    respond_to do |format|
      format.html { redirect_to(weathers_url) }
      format.xml  { head :ok }
    end
  end
end
