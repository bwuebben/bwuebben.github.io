import numpy as np, vtk
from vtk.util.numpy_support import numpy_to_vtk, numpy_to_vtkIdTypeArray
from pathlib import Path
out=Path(__file__).parent
W,H=512,256
L,B=np.meshgrid(np.linspace(-np.pi,np.pi,W),np.linspace(-np.pi/2,np.pi/2,H))
env=np.zeros((H,W,3),np.float32)+[.06,.08,.09]
for a,b,sw,sh,col in [(0.1,.65,.38,.22,[4,4.4,4.5]),(2.2,.35,.12,.55,[5,3.8,2.1]),(-1.9,.5,.48,.18,[2.8,4.1,4.5]),(-.65,-.15,.10,.65,[2,2.5,2.7])]:
 dl=np.angle(np.exp(1j*(L-a))); f=np.exp(-.5*((dl/sw)**4+((B-b)/sh)**4)); env+=f[...,None]*col
im=vtk.vtkImageData(); im.SetDimensions(W,H,1); im.GetPointData().SetScalars(numpy_to_vtk(env.reshape(-1,3).astype(np.float32),deep=True)); tex=vtk.vtkTexture(); tex.SetInputData(im); tex.InterpolateOn(); tex.MipmapOn()
s=np.linspace(0,np.pi/2,81); t=np.linspace(-1.05,1.05,101); w=s[:,None]+1j*t[None,:]; a=np.cos(w)**.4; b=np.sin(w)**.4; zeta=np.exp(2j*np.pi/5)
ix=np.arange(w.size).reshape(w.shape); q=np.stack([ix[:-1,:-1],ix[1:,:-1],ix[1:,1:],ix[:-1,1:]],-1).reshape(-1,4); tri=np.concatenate([q[:,[0,1,2]],q[:,[0,2,3]]]); conn=numpy_to_vtkIdTypeArray(tri.ravel(),deep=True); offsets=numpy_to_vtkIdTypeArray(np.arange(0,tri.size+1,3,dtype=np.int64),deep=True)
for name,theta,az,el in [('A',.68,-57,24),('B',.96,25,15),('C',.32,65,38)]:
 r=vtk.vtkRenderer(); r.SetBackground(.017,.045,.052); r.SetBackground2(.035,.105,.115); r.GradientBackgroundOn(); r.SetEnvironmentTexture(tex); r.UseImageBasedLightingOn(); r.AutomaticLightCreationOff(); r.SetUseSphericalHarmonics(False)
 residual=0
 for j in range(5):
  for k in range(5):
   u=zeta**j*a; v=zeta**k*b; residual=max(residual,np.max(abs(u**5+v**5-1))); p=np.stack([u.real,v.real,np.cos(theta)*u.imag+np.sin(theta)*v.imag],-1)
   pts=vtk.vtkPoints(); pts.SetData(numpy_to_vtk(p.reshape(-1,3),deep=True)); cells=vtk.vtkCellArray(); cells.SetData(offsets,conn); pd=vtk.vtkPolyData(); pd.SetPoints(pts); pd.SetPolys(cells)
   normals=vtk.vtkPolyDataNormals(); normals.SetInputData(pd); normals.SplittingOff(); normals.ConsistencyOn(); normals.ComputePointNormalsOn(); normals.Update()
   mapper=vtk.vtkPolyDataMapper(); mapper.SetInputConnection(normals.GetOutputPort()); act=vtk.vtkActor(); act.SetMapper(mapper); prop=act.GetProperty(); prop.SetInterpolationToPBR(); prop.SetMetallic(.92); prop.SetRoughness(.18); prop.SetColor(*([(0.035,.55,.47),(.75,.39,.11),(.08,.62,.55),(.95,.65,.24),(.035,.42,.38)][(j+2*k)%5])); r.AddActor(act)
 for pos,c,intensity in [((3,-4,5),(.8,1,1),2),((-4,2,3),(1,.77,.43),2),((1,4,-1),(.5,1,1),1)]:
  l=vtk.vtkLight(); l.SetLightTypeToSceneLight(); l.SetPosition(*pos); l.SetFocalPoint(0,0,0); l.SetColor(*c); l.SetIntensity(intensity); r.AddLight(l)
 win=vtk.vtkEGLRenderWindow(); win.SetOffScreenRendering(1); win.SetSize(1100,1100); win.SetMultiSamples(4); win.AddRenderer(r); cam=r.GetActiveCamera(); cam.SetPosition(0,0,7); cam.SetViewUp(0,1,0); cam.Azimuth(az); cam.Elevation(el); cam.ParallelProjectionOn(); r.ResetCamera(); cam.Zoom(1.28); r.ResetCameraClippingRange(); win.Render(); cap=vtk.vtkWindowToImageFilter(); cap.SetInput(win); cap.Update(); writer=vtk.vtkPNGWriter(); writer.SetFileName(str(out/f'metal_quintic_{name}.png')); writer.SetInputConnection(cap.GetOutputPort()); writer.Write(); print(name,residual,flush=True); win.Finalize()
