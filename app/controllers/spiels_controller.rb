class SpielsController < ApplicationController
  # GET /spiels
  # GET /spiels.xml
  def index
    @spiels = Spiel.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @spiels }
    end
  end

  # GET /spiels/1
  # GET /spiels/1.xml
  def show
    @spiel = Spiel.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @spiel }
    end
  end

  # GET /spiels/new
  # GET /spiels/new.xml
  def new
    @spiel = Spiel.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @spiel }
    end
  end

  # GET /spiels/1/edit
  def edit
    @spiel = Spiel.find(params[:id])
  end

  # POST /spiels
  # POST /spiels.xml
  def create
    @spiel = Spiel.new(params[:spiel])

    respond_to do |format|
      if @spiel.save
        format.html { redirect_to(@spiel, :notice => 'Spiel was successfully created.') }
        format.xml  { render :xml => @spiel, :status => :created, :location => @spiel }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @spiel.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /spiels/1
  # PUT /spiels/1.xml
  def update
    @spiel = Spiel.find(params[:id])

    respond_to do |format|
      if @spiel.update_attributes(params[:spiel])
        format.html { redirect_to(@spiel, :notice => 'Spiel was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @spiel.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /spiels/1
  # DELETE /spiels/1.xml
  def destroy
    @spiel = Spiel.find(params[:id])
    @spiel.destroy

    respond_to do |format|
      format.html { redirect_to(spiels_url) }
      format.xml  { head :ok }
    end
  end
end
