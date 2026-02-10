import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForceUpdate } from '@/hooks/useForceUpdate';

export const UpdateNotification = () => {
  const { updateInfo, forceReload, dismissUpdate } = useForceUpdate();

  if (!updateInfo.hasUpdate) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-4">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-sm font-semibold text-blue-900">
                Mise à jour disponible
              </CardTitle>
              <CardDescription className="text-xs text-blue-700">
                Une nouvelle version de Studyia Career est disponible
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={dismissUpdate}
              className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button
              onClick={forceReload}
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Mettre à jour
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={dismissUpdate}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Plus tard
            </Button>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            Version actuelle: {updateInfo.currentVersion} → Nouvelle: {updateInfo.newVersion}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
